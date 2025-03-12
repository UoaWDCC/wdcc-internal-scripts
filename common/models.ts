export type Applicant = {
  id: string;
  name: string;
  email: string;
  // ...
};

export type Project = {
  id: string;
  name: string;
  // ...
};

export type Allocation = {
  project: Project;
  applicants: Applicant[];
};