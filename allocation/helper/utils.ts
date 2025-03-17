import { Allocation, Applicant } from "../../common/models.js";

export function logAllocationRanking(allocation: Allocation[]) {
    for (const projectAllocation of allocation) {
        console.log(projectAllocation.project.name);
        console.log(projectAllocation.applicants.length);
        for (const applicant of projectAllocation.applicants) {
            console.log(`  ${applicant.name} - ${applicant.projectChoices.indexOf(projectAllocation.project.name) + 1}`);
        }
    }
}

export function logAllocationRankingList(allocation: Allocation[]) {
    for (const projectAllocation of allocation) {
        console.log(projectAllocation.project.name);
        console.log(projectAllocation.applicants.length);
        const temp = {
            0: [] as Applicant[],
            1: [] as Applicant[],
            2: [] as Applicant[],
            3: [] as Applicant[],
            4: [] as Applicant[],
            5: [] as Applicant[],
        }
        for (const applicant of projectAllocation.applicants) {
            temp[applicant.projectChoices.indexOf(projectAllocation.project.name) + 1].push(applicant.name)
        }

        console.log(`  0 (${temp[0].length}): ${temp[0].join(", ")}`);
        console.log(`  1 (${temp[1].length}): ${temp[1].join(", ")}`);
        console.log(`  2 (${temp[2].length}): ${temp[2].join(", ")}`);
        console.log(`  3 (${temp[3].length}): ${temp[3].join(", ")}`);
        console.log(`  4 (${temp[4].length}): ${temp[4].join(", ")}`);
        console.log(`  5 (${temp[5].length}): ${temp[5].join(", ")}`);

    }
}
