import { Allocation, Applicant, Project } from "../../common/models.js";
import { config } from "../../config.js";

/**
 * Helper function to get total utility (happiness score) of a full set of project allocations.
 * This is the objective function.
 */
export function calculateTotalUtility(allocations: Allocation[]): number {
    return allocations.map((allocation) => calculateUtilityOfAllocation(allocation)).reduce((sum, utility) => sum + utility);
}

/**
 * Get utility (happiness score) from a certain allocation.
 *
 * @param allocation An allocation of applicants to a single project
 */
export function calculateUtilityOfAllocation(allocation: Allocation, log: boolean = false): number {
    const { project, applicants } = allocation;
    const n = applicants.length;

    // I need these names to be short for my sanity sorry
    let projectPrefScore = 0; // Overall PROJECT CHOICE satisfaction metric
    let bePrefSum = 0;
    let beExpSum = 0;
    let feExpSum = 0;
    for (const applicant of applicants) {
        projectPrefScore += getApplicantUtilityFromProject(applicant, project);
        bePrefSum += applicant.backendPreference;
        beExpSum += applicant.backendExperience;
        feExpSum += applicant.frontendExperience;
    }

    // Overall ROLE (FE/BE) dissatisfaction metric
    const targetBePrefSum = n * project.backendWeighting * 5/7; // project.backendWeighting out of 7 for some reason
    const rolePrefDeviation = Math.abs(bePrefSum - targetBePrefSum) * 5/4; // Max deviation is 4 pp

    // Experience level metrics
    const beExpScore = beExpSum * project.backendDifficulty / 5;
    const feExpScore = feExpSum * project.frontendDifficulty / 5;

    // TODO needs priority and role preference
    const { A, B, C, D } = config.allocation;
    const objectiveScore = A * projectPrefScore;
    // const objectiveScore = A * projectPrefScore - B * rolePrefDeviation + C * beExpScore + D * feExpScore;

    // Logging (bit of a hack...)
    if (log) {
        console.log(`  Proj pref: ${projectPrefScore.toFixed(2)}/${n*5}`);
        console.log(`  Role pref: ${(n*5 - rolePrefDeviation).toFixed(2)}/${n*5}`);
        console.log(`  BE exp:    ${beExpScore.toFixed(2)}/${n*5}`);
        console.log(`  FE exp:    ${feExpScore.toFixed(2)}/${n*5}`);
        console.log(`  Objective: ${objectiveScore.toFixed(2)}`);
    }

    return objectiveScore;
}

/** 5 for first choice, 4 for second choice ... 0 for not chosen */
function getApplicantUtilityFromProject(applicant: Applicant, project: Project): number {
    for (const [i, choice] of applicant.projectChoices.entries()) {
        if (choice === project.name) {
            return 5 - i;
        }
    }
    return 0;
}
