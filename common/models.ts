export type Applicant = {
  timestamp: Date
  id: string;
  name: string;
  email: string;
  github: string;
  major: string;
  rolePreference: string;
  skills: string[];
  backendPreference: number;
  frontendExperience: number;
  backendExperience: number
  designExperience: number
  testingExperience: number //not too important ?
  projectChoices: string[] //index 0 is highest preferences
  passionBlurb: string // not used
  portfolioLink: string //not used
  additionalInfo: string //not used
  execComments: string // not used
  rizzLevel: number // not used

};

export type Team = {
  id: string;
  name: string;
  // ...
};

export type Allocation = {
  team: Team;
  applicants: Applicant[];
}