export type Applicant = {
	id: number;
    timestamp: Date;
    name: string;
    email: string;
	major: string;
	rolePreference: string; // out of 5
    github: string;
    skills: string[];
    backendPreference: number; // out of 5
	portfolioLink: string; // not used
    frontendExperience: number; // out of 5
    backendExperience: number; // out of 5
    designExperience: number; // out of 5
    testingExperience: number; // out of 5, not too important?
    projectChoices: string[]; // index 0 is highest preference
    passionBlurb: string; // not used
	cvLink: string,
	jobContact: string,
    additionalInfo: string; // not used
    execComments: string; // exec notes from the raw form
};

export type Project = {
    id: number;
    name: string;
	backendWeighting: number; // out of 5
    backendDifficulty: number; // out of 5
    frontendDifficulty: number; // out of 5
    experienceWeighting: number; // 0 is no change, I expect values in range [-2, 2]
};

export type Allocation = {
    project: Project;
    applicants: Applicant[];
	teamSize: number;
};
