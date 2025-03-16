export type Applicant = {
  timestamp: Date;
  id: number;
  name: string;
  email: string;
  github: string;
  major: string;
  rolePreference: string;
  skills: string[];
  backendPreference: number;
  frontendExperience: number;
  backendExperience: number;
  designExperience: number;
  testingExperience: number; //not too important ?
  projectChoices: string[]; //index 0 is highest preferences
  passionBlurb: string; // not used
  portfolioLink: string; //not used
  additionalInfo: string; //not used
  execComments: string; // not used
  creativityHire: string; // if
  rizzLevel: number; // not used
};

export type Project = {
  id: number;
  name: string;
  backendDifficulty: number;
  frontendDifficulty: number;
  backendWeighting: number
  priority: number;
};

export type Allocation = {
  project: Project;
  applicants: Applicant[];
};
