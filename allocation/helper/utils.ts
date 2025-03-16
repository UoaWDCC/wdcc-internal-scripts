import { Allocation, Project } from "../../common/models.js";

/** Projects -> Allocations */
export function createAllocations(projects: Project[]): Allocation[] {
  return projects.map((project) => ({project, applicants: []}));
}
