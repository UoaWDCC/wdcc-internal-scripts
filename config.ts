// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { calculateTotalUtility } from "./allocation/helper/objective.js"; // Imported for docs

export const config = {
  common: {},
  preprocess: {
    inFile: "applicants.csv",
    outFile: "applicants-processed.csv",
  },
  filter: {
    inFile: "applicants-processed.csv",
    outFile: "applicants-accepted.csv",
    outFileRejected: "applicants-rejected.csv",
  },
  allocation: {
    inFileApplicants: "./data/processedApplicants.csv",
    inFileTeams: "./data/projectsData.csv",
    outFileFormat: "./data/applicants-<team>.csv",
    /** @see calculateTotalUtility */
    A: 1,
    B: 1,
    C: 1,
    D: 1,
  },
};

export type Config = typeof config;
