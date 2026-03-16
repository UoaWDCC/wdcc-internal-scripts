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
                // Only swap if the loser's chosen project is this one, or they still have other choices
                if (loserChosen === currChoice || lowest.projectChoices.length > 0) {
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
    }));

    // change the applicants list to the original applicant list
    for (const al of arr) {
        al.applicants = al.applicants.map((applicant) => applicants.find((a) => a.id === applicant.id)!);
    }

    // Validation: ensure no one is in a project they didn't choose
    for (const allocation of arr) {
        for (const applicant of allocation.applicants) {
            const chosen = applicantChosenProject.get(applicant.id);
            if (chosen && chosen !== allocation.project.name) {
                console.warn(`[ERROR] ${applicant.name} is in ${allocation.project.name} but chose ${chosen}`);
            }
        }
    }

    console.log(`[INFO] Allocation complete. Unmatched applicants: ${unmatched.length}`);
    for (const app of unmatched) {
        const origApp = applicants.find((a) => a.id === app.id);
        const choices = origApp?.projectChoices.map((project) => project.substring(0, 5)).join(", ") || "none";
        console.log(`[UNMATCHED] ${app.name} - preferences: ${choices}`);
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

