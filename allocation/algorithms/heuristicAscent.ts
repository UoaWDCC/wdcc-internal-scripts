import { Allocation, Applicant, Project } from "../../common/models.js";
import { randomlyAllocate } from "../helper/random.js";
import { createAllocations } from "../helper/utils.js";

export function heuristicAscent(applicants: Applicant[], projects: Project[]): Allocation[] {
  // This allocation gets mutated
  const allocations = createAllocations(projects);
  randomlyAllocate(allocations, applicants);


  return allocations;
}
