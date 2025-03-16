import { Allocation, Applicant, Project } from "../../common/models.js";
import { config } from "../../config.js";
import { calculateUtilityOfAllocation } from "../helper/objective.js";
import { randomlyAllocate } from "../helper/random.js";
import { createAllocations } from "../helper/utils.js";

/** Just a regular allocation with a cached utility */
type AnnotatedAllocation = Allocation & { utility: number };

/**
 * Represents two applicants to swap
 *
 * @param alloc1 Allocation first applicant belongs to
 * @param i Index of first applicant in alloc1.applicants
 * @param alloc2 Allocation second applicant belongs to
 * @param j Index of second applicant in alloc2.applicants
 */
type Swap = { alloc1: AnnotatedAllocation, i: number, alloc2: AnnotatedAllocation, j: number };

const {A, B, C, D} = config.allocation;

export function heuristicAscent(applicants: Applicant[], projects: Project[]): Allocation[] {
  const rawAllocations = createAllocations(projects); // This allocation gets mutated
  randomlyAllocate(rawAllocations, applicants);

  // Set up Allocation utilities and initial total utility
  let totalUtility = 0;
  const allocations: AnnotatedAllocation[] = rawAllocations.map(allocation => {
    const utility = calculateUtilityOfAllocation(allocation, A, B, C, D);
    totalUtility += utility;
    return {...allocation, utility};
  });
  console.log(`Beginning ascent with starting utility of ${totalUtility}.`)

  // Do ascent
  const swap = { alloc1Index: 0, i: 0, alloc2Index: 1, j: 0 };
  let numIgnoresInRow = 0;
  const maxIgnoresInRow = getMaxIgnores(projects.length, applicants.length);
  while (numIgnoresInRow < maxIgnoresInRow) {
    const utilityChange = swapApplicants({
      ...swap,
      alloc1: allocations[swap.alloc1Index],
      alloc2: allocations[swap.alloc2Index]
    });

    if (utilityChange === 0) numIgnoresInRow++;
    totalUtility += utilityChange;
  }

  return allocations;
}

/**
 * maxIgnores = applicantsPerProject * (numProjects - 1)
 * Rounds up to overestimate.
 */
function getMaxIgnores(numProjects: number, numApplicants: number) {
  if (numProjects === 0 || numApplicants === 0) return 0;
  const maxApplicantsPerProject = Math.ceil(numApplicants / numProjects);
  return maxApplicantsPerProject * (numProjects - 1);
}

/**
 * Checks if swapping two applicants will improve the overall objective score.
 * If yes, swaps and updates AnnotatedAllocation utilities (mutates allocations).
 * If no, does not swap.
 *
 * @param swap the swap to attempt
 * @returns Net change in utility (0 if no swap)
 */
function swapApplicants(swap: Swap): number {
  const  { alloc1, i, alloc2, j } = swap;
  const alloc1OldUtility = alloc1.utility;
  const alloc2OldUtility = alloc2.utility;

  // Swap
  [alloc1.applicants[i], alloc2.applicants[j]] = [alloc2.applicants[j], alloc1.applicants[i]];

  const alloc1NewUtility = calculateUtilityOfAllocation(alloc1, A, B, C, D);
  const alloc2NewUtility = calculateUtilityOfAllocation(alloc2, A, B, C, D);
  const netChangeInUtility = alloc1NewUtility + alloc2NewUtility - alloc1OldUtility - alloc2OldUtility;

  // Check if worth it
  if (netChangeInUtility > 0) {
    console.log(`Found swap with net utility change ${netChangeInUtility}. Swapped!`);
    alloc1.utility = alloc1NewUtility;
    alloc2.utility = alloc2NewUtility;
    return netChangeInUtility;
  } else {
    console.log(`Found swap with net utility change ${netChangeInUtility}. Ignoring.`);
    // Swap back
    [alloc1.applicants[i], alloc2.applicants[j]] = [alloc2.applicants[j], alloc1.applicants[i]];
    return 0; // Report 0 since no swap
  }
}
