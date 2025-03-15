import { Allocation, Applicant, Project } from "../../common/models.js";

/**
 * Helper function to get total utility (happiness score) of a full set of project allocations.
 * This is the objective function.
 *
 * @param allocations A complete allocation of all members to projects
 * @param A Arbitrary constant to control weighting of project preference
 * @param B Arbitrary constant to control weighting of role (BE/FE) preference
 * @param C Arbitrary constant to control weighting of BE experience
 * @param D Arbitrary constant to control weighting of FE experience
 */
export function calculateTotalUtility(allocations: Allocation[], A: number, B: number, C: number, D: number): number {
  return allocations.map((allocation) => calculateUtilityOfAllocation(allocation, A, B, C, D)).reduce((sum, utility) => sum + utility);
}

/**
 * Get utility (happiness score) from a certain allocation.
 *
 * @param allocation An allocation of applicants to a single project
 * @param A Arbitrary constant to control weighting of project preference
 * @param B Arbitrary constant to control weighting of role (BE/FE) preference
 * @param C Arbitrary constant to control weighting of BE experience
 * @param D Arbitrary constant to control weighting of FE experience
 */
export function calculateUtilityOfAllocation(allocation: Allocation, A: number, B: number, C: number, D: number): number {
  const {project, applicants} = allocation;

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
  const targetBePrefSum = applicants.length * project.backendWeighting;
  const rolePrefDeviation = Math.abs(bePrefSum - targetBePrefSum);

  // Experience level metrics
  const beExpScore = beExpSum * project.backendDifficulty;
  const feExpScore = feExpSum * project.frontendDifficulty;

  return A*projectPrefScore - B*rolePrefDeviation + C*beExpScore + D*feExpScore;
}

/** 5 for first choice, 4 for second choice ... 0 for not chosen */
function getApplicantUtilityFromProject(applicant: Applicant, project: Project): number {
  for (const [i, choice] of applicant.projectChoices.entries()) {
    if (choice === project.id) {
      return 5 - i;
    }
  }
  return 0;
}
