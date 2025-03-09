// --- We might have to try multiple algorithms... ---

import { Allocation, Applicant, Team } from "../../common/models.js";

type Config = {
  A: number;
};

export function integerProgramming(
  applicants: Applicant[],
  teams: Team[],
  config: Config
): Allocation[] {
  console.log("Running allocation script,", applicants, teams, config);
  return [];
}
