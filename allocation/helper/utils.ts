import { Allocation } from "../../common/models.js";
import { calculateTotalUtility, calculateUtilityOfAllocation } from "./objective.js";

export function logAllocationRanking(allocation: Allocation[]) {
    for (const projectAllocation of allocation) {
        console.log(projectAllocation.project.name);
        console.log(projectAllocation.applicants.length);
        for (const applicant of projectAllocation.applicants) {
            console.log(`  ${applicant.name} - ${applicant.projectChoices.indexOf(projectAllocation.project.name) + 1}`);
        }
    }
}

export function logAllocationRankingList(allocations: Allocation[], baselineAllocations: Allocation[]) {
    for (const projectAllocation of allocations) {
        console.log();
        console.log(`PROJECT ${projectAllocation.project.name} (count: ${projectAllocation.applicants.length})`);
        calculateUtilityOfAllocation(projectAllocation, true);
        const temp: Record<number, string[]> = {
            0: [],
            1: [],
            2: [],
            3: [],
            4: [],
            5: [],
        }
        for (const applicant of projectAllocation.applicants) {
            temp[applicant.projectChoices.indexOf(projectAllocation.project.name) + 1].push(applicant.name)
        }

        console.log(`  1  (${temp[1].length}): ${temp[1].join(", ")}`);
        console.log(`  2  (${temp[2].length}): ${temp[2].join(", ")}`);
        console.log(`  3  (${temp[3].length}): ${temp[3].join(", ")}`);
        console.log(`  4  (${temp[4].length}): ${temp[4].join(", ")}`);
        console.log(`  5  (${temp[5].length}): ${temp[5].join(", ")}`);
        console.log(`  -1 (${temp[0].length}): ${temp[0].join(", ")}`);
    }

    // Final Output
    const numApplicants = countAllApplicants(allocations);
    const finalObjectiveScore = calculateTotalUtility(allocations);
    const utilityPerApplicant = (finalObjectiveScore / numApplicants).toFixed(2);
    console.log();
    console.log(`Allocated ${numApplicants} applicants to ${allocations.length} projects! Total utility: ${finalObjectiveScore.toFixed(2)}. Utility per applicant: ${utilityPerApplicant}`);

    // Baseline
    const baselineNumApplicants = countAllApplicants(baselineAllocations);
    const baselineObjectiveScore = calculateTotalUtility(baselineAllocations);
    const baselineUtilityPerApplicant = (baselineObjectiveScore / baselineNumApplicants).toFixed(2);
    console.log(`                    [RANDOM BASELINE]  Total utility: ${baselineObjectiveScore.toFixed(2)}. Utility per applicant: ${baselineUtilityPerApplicant}`);
    console.log();
}

/** Helper method to loop through and sum all the applicants in a set of allocations */
export function countAllApplicants(allocations: Allocation[]): number {
    let count = 0;
    for (const allocation of allocations) {
        count += allocation.applicants.length;
    }
    return count;
}
