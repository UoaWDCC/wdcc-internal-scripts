export const config = {
    preprocess: {
        inFile: "./data/applicants.csv",
        outFile: "./data/processedApplicants.csv",
        outFileDesigners: "./data/designers.csv",
        outFileFlagged: "./data/flaggedApplicants.csv",
    },
    allocation: {
        inFileApplicants: "./data/applicants.csv",
        inFileTeams: "./data/projectsData.csv",
        outFileFormat: "./data/out/applicants-<team>.csv",
        // Arbitrary constants to control objective function weighting
        A: 1, // project preference
        B: 0.5, // role (BE/FE) preference
        C: 1.1, // BE experience
        D: 1.1, // FE experience
        E: 0.1, // Priority
        F: 10, // Project requests
        numAscents: 5,
    },
};

export type Config = typeof config;
