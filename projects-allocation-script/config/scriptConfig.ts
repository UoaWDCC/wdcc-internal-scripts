export const preprocessConfig = {
	inputFile: "./data/applicants.csv",
	outputFile: "./data/processedApplicants.csv",
	outputFileDesigners: "./data/out/designers.csv",
	outputFileFlagged: "./data/out/flaggedApplicants.csv",
}

export const allocationConfig = {
	inputFileApplicants: "./data/processedApplicants.csv",
	inputFileProjects: "./data/projectsData.csv",
	outputFileFormat: "./data/out/applicants-<team>.csv",

	// coefficients
	projectPreference: 1, // A
	rolePreference: 0.5, // B
	backendExperience: 1.1, // C
	frontendExperience: 1.1, // D
	experienceWeighting: 0.1, // E

	numAscents: 5,
}
