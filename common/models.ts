export type Applicant = {
  id: string;
  name: string;
  email: string;
  // ...
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