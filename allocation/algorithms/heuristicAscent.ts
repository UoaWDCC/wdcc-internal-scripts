import { Allocation, Applicant, Project } from "../../common/models.js";
import { config } from "../../config.js";
import { calculateUtilityOfAllocation } from "../helper/objective.js";
import { randomlyAllocate } from "../helper/random.js";
import { countAllApplicants } from "../helper/utils.js";

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

const {A, B, C, D, numAscents} = config.allocation;

/**
 * Uses next descent to find a good allocation of applicants to projects with random restarts
 * @see https://en.wikipedia.org/wiki/Local_search_(optimization)
 *
 * @param applicants A list of applicants
 * @param projects A list of project preferences
 * @returns A list of allocations: { project, applicants[] }
 */
export function randomHeuristicAscent(applicants: Applicant[], projects: Project[]): Allocation[] {
  return heuristicAscent(() => randomlyAllocate(projects, applicants));
}

/**
 * Uses next descent to find a good allocation of applicants to projects based on a provided starting set of allocations
 * @see https://en.wikipedia.org/wiki/Local_search_(optimization)
 *
 * @param applicants A list of applicants
 * @param projects A list of project preferences
 * @returns A list of allocations: { project, applicants[] }
 */
export function heuristicAscent(generator: () => Allocation[]): Allocation[] {
  let highestUtility = 0;
  let bestAllocation: Allocation[] = [];

  // Repeat singleHeuristicAscent() numAscents times
  for (let i = 0; i < numAscents; i++) {
    console.log(`BEGINNING RUN ${i}`);
    const [allocation, utility] = singleHeuristicAscent(generator());
    console.log(`Found allocation of utility ${utility}`);
    if (utility > highestUtility) {
      console.log(`Keeping! (Previous best was ${highestUtility})`);
      highestUtility = utility;
      bestAllocation = allocation;
    }
  }

  return bestAllocation;
}

/**
 * Performs a single run of heuristicAscent (random reset + ascent towards higher utility).
 *
 * @param applicants
 * @param projects
 * @returns 2-tuple: [set of final allocations, final utility]
 */
function singleHeuristicAscent(startingAllocations: Allocation[]): [Allocation[], number] {

  // Set up Allocation utilities and initial total utility
  let totalUtility = 0;
  const allocations: AnnotatedAllocation[] = startingAllocations.map(allocation => {
    const utility = calculateUtilityOfAllocation(allocation, A, B, C, D);
    totalUtility += utility;
    return {...allocation, utility};
  });
  console.log(`Beginning ascent with starting utility of ${totalUtility}.`)

  // Do ascent
  const swap = { alloc1Index: 0, i: 0, alloc2Index: 1, j: 0 };
  let numIgnoresInRow = 0;
  const maxIgnoresInRow = getMaxIgnores(allocations.length, countAllApplicants(allocations));
  while (numIgnoresInRow < maxIgnoresInRow) {
    // Try swap
    const utilityChange = swapApplicants({
      ...swap,
      alloc1: allocations[swap.alloc1Index],
      alloc2: allocations[swap.alloc2Index]
    });

    // console.log(`******************************** ${numIgnoresInRow}/${maxIgnoresInRow}: ${utilityChange}`)

    // Check and update bookkeeping
    if (utilityChange === 0) {
      numIgnoresInRow++;
    } else {
      numIgnoresInRow = 0;
      totalUtility += utilityChange;
    }

    // Move to next swap (try out all possible swaps)
    const alloc1Len = allocations[swap.alloc1Index].applicants.length;
    swap.i = (swap.i + 1) % alloc1Len;
    if (swap.i === 0) swap.alloc1Index = swap.alloc1Index % allocations.length;
    if (swap.i === 0 && swap.alloc1Index === 0) {
      // Move second pointer only once first pointer has done a full applicantsPerProject * numProjects sweep
      const alloc2Len = allocations[swap.alloc2Index].applicants.length;
      swap.j = (swap.j + 1) % alloc2Len;
      if (swap.j === 0) swap.alloc2Index = swap.alloc2Index % allocations.length;
    }
  }

  return [allocations, totalUtility];
}

/**
 * maxIgnores = applicantsPerProject * (numProjects - 1)
 * Rounds up to overestimate.
 */
function getMaxIgnores(numProjects: number, numApplicants: number) {
  if (numProjects === 0 || numApplicants === 0) return 0;
  const maxApplicantsPerProject = Math.ceil(numApplicants / numProjects);
  return (maxApplicantsPerProject * numProjects) * (maxApplicantsPerProject * (numProjects - 1));
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
    // console.log(`Found swap with net utility change ${netChangeInUtility}. Ignoring.`);
    // Swap back
    [alloc1.applicants[i], alloc2.applicants[j]] = [alloc2.applicants[j], alloc1.applicants[i]];
    return 0; // Report 0 since no swap
  }
}
