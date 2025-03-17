import { Allocation, Applicant, Project } from "../../common/models.js";

/**
 * Randomly orders the array. Does not mutate the array.
 * @see https://stackoverflow.com/a/12646864
 */
function shuffleArray<T>(array: T[]) {
  const arr = [...array];
  for (let i = arr.length - 1; i >= 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Randomly allocates applicants evenly to projects.
 * Divies up any remainder randomly as well (if projects % applicants != 0).
 * Doesn't mutate anything.
 *
 * @returns	A list of allocations { project, applicants[] }.
 */
export function randomlyAllocate(projects: Project[], applicants: Applicant[]): Allocation[] {
  // Init allocations
  const allocations: Allocation[] = projects.map((project) => ({ project, applicants: [] }));

  // Stats
  const numProjects = allocations.length;
  const numApplicants = applicants.length;
  const applicantsPerProject = Math.floor(numApplicants / numProjects);
  const leftOverApplicants = numApplicants % numProjects;

  // Shuffle to avoid bias in the order of applicants
  const shuffledApplicants = shuffleArray(applicants);
  const shuffledAllocations = shuffleArray(allocations); // Aka projects

  /*
    Say there are 12 applicants for 5 projects. This does:
    Proj A: 3
    Proj B: 3
    Proj C: 2
    Proj D: 2
    Proj E: 2
  */
  let nextApplicant = 0;
  for (let i = 0; i < numProjects; i++) {
    const numApplicantsToTake = i < leftOverApplicants ? applicantsPerProject + 1: applicantsPerProject;
    shuffledAllocations[i].applicants = shuffledApplicants.slice(nextApplicant, nextApplicant + numApplicantsToTake);
    nextApplicant += numApplicantsToTake;
  }

  return allocations;
}
