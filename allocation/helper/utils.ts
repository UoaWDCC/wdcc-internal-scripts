import { Project } from "../../common/models.js";

/** Projects -> Allocations */
export function createAllocations(projects: Project[]) {
  return projects.map((project) => ({project, applicants: []}));
}
