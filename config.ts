export const config = {
  common: {},
  preprocess: {
    inFile: "applicants.csv",
    outFile: "applicants-processed.csv",
  },
  filter: {
    inFile: "applicants-processed.csv",
    outFile: "applicants-filtered.csv",
  },
  allocation: {
    inFileApplicants: "applicants-filtered.csv",
    inFileTeams: "team-preferences.csv",
    outFileFormat: "applicants-<team>.csv",
  },
};

export type Config = typeof config;
