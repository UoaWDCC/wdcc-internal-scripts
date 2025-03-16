// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { calculateTotalUtility } from "./allocation/helper/objective.js"; // Imported for docs

export const config = {
  preprocess: {
    inFile: "./data/applicants.csv",
    outFile: "./data/processedApplicants.csv",
    outFileDesigners: "./data/designers.csv",
    outFileFlagged: "./data/flaggedApplicants.csv",
  },
  allocation: {
    inFileApplicants: "./data/processedApplicants.csv",
    inFileTeams: "./data/projectsData.csv",
    outFileFormat: "./data/out/applicants-<team>.csv",
    /** @see calculateTotalUtility */
    A: 1,
    B: 1,
    C: 1,
    D: 1,
  },
};

export type Config = typeof config;
