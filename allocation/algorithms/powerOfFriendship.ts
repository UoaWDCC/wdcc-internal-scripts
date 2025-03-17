import { Allocation, Applicant, Project } from "../../common/models.js";
import { heuristicAscent } from "./heuristicAscent.js";
import { stableMatching } from "./stableMatching.js";

/** 🤝 */
export function powerOfFriendship(applicants: Applicant[], projects: Project[]): Allocation[] {
  return heuristicAscent(() => stableMatching(applicants, projects));
}
