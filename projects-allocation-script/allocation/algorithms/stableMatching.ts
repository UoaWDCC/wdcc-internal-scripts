// --- script for gale shapley ---
import { IGetCompareValue, MinPriorityQueue } from "@datastructures-js/priority-queue";
import { Allocation, Applicant, Project } from "../../common/types.js";

class ProjectAllocation {
    project: Project;
    allocated: MinPriorityQueue<Applicant>;
    teamSize: number;
    front_allocated: number;
    back_allocated: number;

    constructor(project: Project, teamSize: number) {
        this.project = project;
        this.allocated = new MinPriorityQueue<Applicant>(getContribution(this));
        this.teamSize = teamSize;
        this.front_allocated = 0;
        this.back_allocated = 0;
    }
}

export function stableMatching(applicants: Applicant[], projects: Project[]): Allocation[] {
    const projectTeamSize = Math.floor(applicants.length / projects.length) + 1;
	console.log(`[INFO] Starting stable matching with team size: ${projectTeamSize}`)
    const allocationResult: Map<string, ProjectAllocation> = new Map(
        projects.map((project) => [project.name, new ProjectAllocation(project, projectTeamSize)])
    );
    const unmatched: Applicant[] = [];
    const applicantChosenProject: Map<number, string> = new Map();
    
    // Save original preferences before they get mutated by shift()
    const originalPreferences: Map<number, string[]> = new Map(
        applicants.map((app) => [app.id, [...app.projectChoices]])
    );

    // put applicants into a queue
    const applicantQueue = structuredClone(applicants);

    while (applicantQueue.length !== 0) {
        const applicant: Applicant = applicantQueue.shift()!;
        const currChoice: string | undefined = applicant.projectChoices.shift();
        if (!currChoice) {
			// this means that applicant did not get chosen for any of their choices
            unmatched.push(applicant);
            continue;
        }

        applicantChosenProject.set(applicant.id, currChoice);
        
        const currAllocation: ProjectAllocation = allocationResult.get(currChoice)!;
        if (currAllocation.allocated.size() < projectTeamSize) {
            currAllocation.allocated.enqueue(applicant);
            updateCapacity(currAllocation, applicant, 1);
        } else {
            const lowest: Applicant = currAllocation.allocated.front()!;
			const applicantContribution = getContribution(currAllocation)(applicant);
			const lowestContribution = getContribution(currAllocation)(lowest);

            if (applicantContribution > lowestContribution) {
                const loserChosen = applicantChosenProject.get(lowest.id);
                const loserHasOtherChoices = lowest.projectChoices.length > 0;
                
                // Only swap if the loser's chosen project is this one, or they still have other original choices
                if (loserChosen === currChoice || loserHasOtherChoices) {
                    currAllocation.allocated.dequeue();
                    updateCapacity(currAllocation, lowest, -1);
                    currAllocation.allocated.enqueue(applicant);
                    updateCapacity(currAllocation, applicant, 1);
                    applicantQueue.push(lowest);
                } else {
                    applicantQueue.push(applicant);
                }
            } else {
                applicantQueue.push(applicant);
            }
        }
    }
    // change format to Allocation[]
    const arr: Allocation[] = Array.from(allocationResult.values()).map((projectAllocation) => ({
        project: projectAllocation.project,
        applicants: projectAllocation.allocated.toArray(),
		teamSize: projectAllocation.teamSize,
    }));

    // change the applicants list to the original applicant list
    for (const al of arr) {
        al.applicants = al.applicants.map((applicant) => applicants.find((a) => a.id === applicant.id)!);
    }

    // Redistribution phase to balance team sizes
    redistributeForBalance(
        Array.from(allocationResult.values()),
        applicants,
        applicantChosenProject,
        originalPreferences
    );

    // Rebuild arr with updated allocations after redistribution
    arr.length = 0;
    for (const projectAllocation of allocationResult.values()) {
        const allocatees = projectAllocation.allocated.toArray();
        arr.push({
            project: projectAllocation.project,
            applicants: allocatees.map((applicant) => applicants.find((a) => a.id === applicant.id)!),
			teamSize: projectAllocation.teamSize,
        });
    }

    // Validation: ensure no one is in a project they didn't choose
    for (const allocation of arr) {
        for (const applicant of allocation.applicants) {
            const originalPrefs = originalPreferences.get(applicant.id) || [];

            if (!originalPrefs.includes(allocation.project.name)) {
                console.warn(`[ERROR] ${applicant.name} is in ${allocation.project.name} but originally chose: ${originalPrefs.join(", ")}`);
            }
        }
    }

    console.log(`[INFO] Allocation complete. Unmatched applicants: ${unmatched.length}`);
    for (const app of unmatched) {
        const choices = originalPreferences.get(app.id)?.map((project) => project.substring(0, 5)).join(", ") || "none";
        console.log(`[UNMATCHED] ${app.name}:${app.id} - preferences: ${choices}`);
    }

    return arr;
}

function _calculateContribution(projectAllocation: ProjectAllocation, applicant: Applicant): number {
    const { project, teamSize, front_allocated, back_allocated, allocated } = projectAllocation;
    const { backendWeighting, experienceWeighting } = project;
    const { frontendExperience, backendExperience, backendPreference } = applicant;

    const remainingFrontendCapacity = teamSize * (1 - backendWeighting / 5) - front_allocated;
    const remainingBackendCapacity = teamSize * (backendWeighting / 5) - back_allocated;

    const frontMultiplier = Math.floor(remainingFrontendCapacity);
    const backMultiplier = Math.floor(remainingBackendCapacity);
    const experienceFactor = 2 * (experienceWeighting - 1.5);

    const skillContribution = experienceFactor * (frontMultiplier * frontendExperience + backMultiplier * backendExperience) +
        backendWeighting * backendPreference;

    // Balance factor: prefer projects with fewer allocated applicants
    const balanceWeight = 10;
    const sizeImbalance = teamSize - allocated.size();
    const balanceContribution = balanceWeight * sizeImbalance;

    return skillContribution + balanceContribution;
}

function getContribution(project: ProjectAllocation): IGetCompareValue<Applicant> {
	return (applicant: Applicant) => _calculateContribution(project, applicant)
}

function updateCapacity(allocation: ProjectAllocation, applicant: Applicant, delta: 1 | -1): void {
	allocation.front_allocated += delta * (1 - applicant.backendPreference / 5);
	allocation.back_allocated += delta * applicant.backendPreference / 5;
}

function redistributeForBalance(
    allocations: ProjectAllocation[],
    applicants: Applicant[],
    applicantChosenProject: Map<number, string>,
    originalPreferences: Map<number, string[]>
): void {
    const totalAllocated = allocations.reduce((sum, a) => sum + a.allocated.size(), 0);
    const targetSize = Math.floor(totalAllocated / allocations.length);

    console.log(`[REDISTRIBUTION] Target team size: ${targetSize}`);

    // Try to balance underfilled projects
    for (const underfilled of allocations) {
        // Skip if already at or exceeds target
        if (underfilled.allocated.size() >= targetSize) continue;
        // Skip if at full capacity
        if (underfilled.allocated.size() >= underfilled.teamSize) continue;

        const needed = Math.min(
            targetSize - underfilled.allocated.size(),
            underfilled.teamSize - underfilled.allocated.size()
        );
        console.log(`[REDISTRIBUTION] ${underfilled.project.name} needs ${needed} more members (current: ${underfilled.allocated.size()}, capacity: ${underfilled.teamSize})`);

        for (const overfilled of allocations) {
            if (overfilled.allocated.size() <= targetSize || needed === 0) continue;

            const excess = overfilled.allocated.size() - targetSize;
            let toMove = Math.min(needed, excess);

            // Get array of applicants to potentially move
            const potentialCandidates = overfilled.allocated.toArray();
            const movingCandidates: Applicant[] = [];

            // First pass: identify candidates that prefer underfilled
            for (const applicant of potentialCandidates) {
                if (toMove === 0) break;

                // Check if underfilled is in applicant's ORIGINAL preferences
                const origPrefs = originalPreferences.get(applicant.id) || [];
                if (origPrefs.includes(underfilled.project.name)) {
                    movingCandidates.push(applicant);
                    toMove--;
                }
            }

            // Second pass: actually move the candidates
            for (const applicant of movingCandidates) {
                // Rebuild the queue to remove this specific applicant
                const tempApplicants: Applicant[] = [];
                while (overfilled.allocated.size() > 0) {
                    const item = overfilled.allocated.dequeue();
                    if (item && item.id !== applicant.id) {
                        tempApplicants.push(item);
                    }
                }
                // Re-add all except the one we're moving
                for (const item of tempApplicants) {
                    overfilled.allocated.enqueue(item);
                }

                // Move the applicant
                updateCapacity(overfilled, applicant, -1);
                underfilled.allocated.enqueue(applicant);
                updateCapacity(underfilled, applicant, 1);
                applicantChosenProject.set(applicant.id, underfilled.project.name);

                console.log(`[REDISTRIBUTION] Moved ${applicant.name} from ${overfilled.project.name} to ${underfilled.project.name}`);
            }
        }
    }

    // Log final state
    console.log(`[REDISTRIBUTION] Final team sizes:`);
    for (const allocation of allocations) {
        console.log(`  ${allocation.project.name}: ${allocation.allocated.size()}/${allocation.teamSize} members`);
    }
}

