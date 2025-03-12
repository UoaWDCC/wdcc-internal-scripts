// --- We might have to try multiple algorithms... ---

import { Allocation, Applicant, Project } from "../../common/models.js";

type Config = {
  A: number;
};

export function integerProgramming(
  applicants: Applicant[],
  projects: Project[],
  config: Config
): Allocation[] {
  console.log("Running allocation script,", applicants, projects, config);
  return [];
}
