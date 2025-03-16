import { Allocation, Applicant, Project } from "../../common/models.js";
import { config } from "../../config.js";
import { calculateUtilityOfAllocation } from "../helper/objective.js";
import { randomlyAllocate } from "../helper/random.js";
import { createAllocations } from "../helper/utils.js";

// Lets me cache already calculated results
type AnnotatedAllocation = Allocation & { utility: number };

const {A, B, C, D} = config.allocation;

export function heuristicAscent(applicants: Applicant[], projects: Project[]): Allocation[] {
  // This allocation gets mutated
  const allocations = createAllocations(projects);
  randomlyAllocate(allocations, applicants);


  return allocations;
}

/**
 * Checks if swapping two applicants will improve the overall objective score.
 * If yes, swaps and updates AnnotatedAllocation utilities (mutates allocations).
 * If no, does not swap.
 *
 * @param alloc1 Allocation first applicant belongs to
 * @param i Index of first applicant in alloc1.applicants
 * @param alloc2 Allocation second applicant belongs to
 * @param j Index of second applicant in alloc2.applicants
 * @returns Net change in utility (0 if no swap)
 */
function swapApplicants(alloc1: AnnotatedAllocation, i: number, alloc2: AnnotatedAllocation, j: number): number {
  const alloc1OldUtility = alloc1.utility;
  const alloc2OldUtility = alloc2.utility;

  // Swap
  [alloc1.applicants[i], alloc2.applicants[j]] = [alloc2.applicants[j], alloc1.applicants[i]];

  const alloc1NewUtility = calculateUtilityOfAllocation(alloc1, A, B, C, D);
  const alloc2NewUtility = calculateUtilityOfAllocation(alloc2, A, B, C, D);
  const netChangeInUtility = alloc1NewUtility + alloc2NewUtility - alloc1OldUtility - alloc2OldUtility;

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
