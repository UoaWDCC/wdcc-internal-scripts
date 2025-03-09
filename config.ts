export const config = {
  common: {},
  filter: {
    inFile: "applicants.csv",
    outFile: "applicants-filtered.csv",
  },
  allocation: {
    inFileApplicants: "applicants-filtered.csv",
    inFileTeams: "team-preferences.csv",
    outFileFormat: "applicants-<team>.csv",
  },
};

export type Config = typeof config;
