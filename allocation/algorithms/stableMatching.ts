// --- script for gale shapley ---

import { Allocation, Applicant, Project } from "../../common/models.js";

import { IGetCompareValue, MinPriorityQueue } from "@datastructures-js/priority-queue";

function _calculateContribution(projectAllocation: ProjectAllocation, applicant: Applicant): number {
    // how to calculate the multipliers
    const FRONT = 1;
    const BACK = 1;
    const front_multiplier = FRONT * Math.floor((projectAllocation.teamSize * (1 - (projectAllocation.project.backendWeighting / 7)) - projectAllocation.front_allocated));
    const back_multiplier = BACK * Math.floor((projectAllocation.teamSize * (projectAllocation.project.backendWeighting / 7)) - projectAllocation.back_allocated);

    return 2 * (projectAllocation.project.priority - 1.5) * (front_multiplier * applicant.frontendExperience + back_multiplier * applicant.backendExperience) + projectAllocation.project.backendWeighting * applicant.backendPreference;
}

const getContribution: (project: ProjectAllocation) => IGetCompareValue<Applicant> = (project: ProjectAllocation) => (applicant: Applicant) => _calculateContribution(project, applicant);

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

export function stableMatching(
    applicants: Applicant[],
    projects: Project[]
): Allocation[] {
    const projectTeamSize = Math.floor(applicants.length / projects.length) + 1;
    console.log(projectTeamSize)
    const allocationResult: Map<string, ProjectAllocation> = new Map(
        projects.map(project => [project.name, new ProjectAllocation(project, projectTeamSize)])
    );
    const leftOver: Applicant[] = []

    // put applicants into a queue
    const copyApplicant = structuredClone(applicants)
    const applicantQueue = structuredClone(applicants);

    while (applicantQueue.length !== 0) {
        const applicant: Applicant = applicantQueue.shift()!;
        const currChoice: string = applicant.projectChoices.shift()!;
        if (!currChoice) {
            leftOver.push(applicant)
            continue
        }

        const currAllocation: ProjectAllocation = allocationResult.get(currChoice)!;
        if (applicant.name === "Andy Huang") {
            console.log(`Andy Huang Choices: ${applicant.projectChoices}`)
        }
        if (currAllocation.allocated.size() < projectTeamSize) {
            if (applicant.name === "Andy Huang") {
                console.log("Andy Huang added (1)")
            }
            currAllocation.allocated.enqueue(applicant);
            currAllocation.front_allocated += 1 - (applicant.backendPreference / 5);
            currAllocation.back_allocated += applicant.backendPreference / 5;
        } else {
            const lowest: Applicant = currAllocation.allocated.front()!;
            currAllocation.front_allocated += 1 - (applicant.backendPreference / 5);
            currAllocation.back_allocated += applicant.backendPreference / 5;

            if (getContribution(currAllocation)(applicant) > getContribution(currAllocation)(lowest)) {
                if (applicant.name === "Andy Huang") {
                    console.log("Andy Huang added (2)")
                }
                currAllocation.allocated.dequeue();
                currAllocation.front_allocated -= 1 - (lowest.backendPreference / 5);
                currAllocation.back_allocated -= lowest.backendPreference / 5;
                currAllocation.allocated.enqueue(applicant);
                currAllocation.front_allocated += 1 - (applicant.backendPreference / 5);
                currAllocation.back_allocated += applicant.backendPreference / 5;
                if (lowest.name === "Andy Huang") {
                    console.log("Andy Huang is now removed!")
                }
                applicantQueue.push(lowest);
            } else {
                if (applicant.name === "Andy Huang") {
                    console.log("Andy Huang not added")
                }
                applicantQueue.push(applicant);
            }
        }
        if (applicant.name === "Andy Huang") {
            console.log(`Andy Huang 2 Choices: ${applicant.projectChoices}`)
        }
    }
    console.log(`length of leftover:  ${leftOver.length}`)
    // change format to Allocation[]
    const arr: Allocation[] = Array.from(allocationResult.values()).map(projectAllocation => ({
        project: projectAllocation.project,
        applicants: projectAllocation.allocated.toArray()
    }));

    // change the applicants list to the original applicant list
    for (const al of arr) {
        al.applicants = al.applicants.map(applicant => copyApplicant.find(a => a.id === applicant.id)!)
    }

    console.log("Leftover")
    for (let app of leftOver) {
        const a = copyApplicant.find(a => a.id === app.id)
        if (!a) {
            console.log(`----${app.name} : ${app.projectChoices} `)
            continue
        }
        console.log(`----${app.name} : ${a.projectChoices.map(project => project.substring(0, 5))} `)
    }

    return arr;
}
