export const APPLICANT_COLUMNS: Record<string, string> = {
	timestamp: "Timestamp",
	name: "What is your full name?",
	email: "Email address?",
	major: "What do you study? (Degree: major)",
	rolePreference: "Role preference",
	github: "What is your GitHub username?",
	skills: "Previous technical experience",
	backendPreference: "What kind of work do you have a higher preference towards learning/doing within projects?",
	portfolioLink: "Do you have a portfolio? If so, please provide a link below:",
	// designer questions (not mapped):
	// -> html/css experience question
	// -> design style, approach, etc
	// -> figma experience
	frontendExperience: "How would you rate your experience level in the following areas? [Front-end dev]",
	backendExperience: "How would you rate your experience level in the following areas? [Back-end dev]",
	designExperience: "How would you rate your experience level in the following areas? [Design]",
	testingExperience: "How would you rate your experience level in the following areas? [Testing]",
	firstChoice: "Your first choice:",
	secondChoice: "Your second choice:",
	thirdChoice: "Your third choice:",
	fourthChoice: "Your fourth choice:",
	fifthChoice: "Your fifth choice:",
	passionBlurb: "What do you wish to gain from being on a project? (aim for ~100 words)",
	cvLink: "Please upload your CV here (insert a link below)",
	jobContact: "Would you be interested in being contacted about support with job applications and/or potential job opportunities?",
	additionalInfo: "Anything else you would like us to know?",
	execComments: "EXEC NOTES",
}

export const EXPERIENCE_MAPPING: Record<string, number> = {
    "No experience": 1,
    "Low experience (some tutorial videos / playing around)": 2,
    "Moderate experience (course/personal project)": 3,
    "High experience (intern/work project)": 4,
    "Pro (many internships and professional work)": 5,
}

export const PROJECT_COLUMNS: Record<string, string> = {
	name: "What is the name of your project?",
	backendWeighting: "What's the backend-frontend weighting of your project?",
	experienceWeighting: "What's your preference for beginners vs experienced members?",
	frontendDifficulty: "How difficult do you expect your frontend development to be?",
	backendDifficulty: "How difficult do you expect your backend development to be?",
}
