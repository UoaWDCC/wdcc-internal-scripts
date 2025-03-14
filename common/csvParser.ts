import { Applicant, Project } from "./models.js";
import fs from "fs";
import Papa from "papaparse";

/**
 * Parses a CSV file and returns an array of Applicant objects.
 * @param filePath Path to the CSV file.
 * @returns Promise resolving to an array of Applicant objects.
 */
export const parseRawCsvApplicants = (filePath: string): Promise<Applicant[]> => {
  return new Promise((resolve, reject) => {
    const fileContent = fs.readFileSync(filePath, "utf8");

    Papa.parse(fileContent, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        try {
          const applicants: Applicant[] = result.data.map((row: any, index: number) => ({
            timestamp: new Date(row["Timestamp"]),
            id: `applicant-${index + 1}`,
            name: row["What is your full name?"],
            email: row["Email address?"],
            github: row["What is your GitHub username?"],
            major: row["What do you study? (Degree: major)"],
            rolePreference: row["r"],
            skills: row["Skills"]?.split(",").map((s: string) => s.trim()) || [],
            backendPreference: parseInt(row["Backend Preference (1 = FE, 5 = BE)"], 10) || 0,
            frontendExperience: parseInt(row["FE Dev Experience"], 10) || 0,
            backendExperience: parseInt(row["How would you rate your experience level in the following areas? [Back-end dev]"], 10) || 0,
            designExperience: parseInt(row["How would you rate your experience level in the following areas? [Design]"], 10) || 0,
            testingExperience: parseInt(row["How would you rate your experience level in the following areas? [Testing]"], 10) || 0,
            projectChoices: [
              row["Your first choice:"],
              row["Your second choice:"],
              row["Your third choice:"],
              row["Your fourth choice:"],
              row["Your fifth choice:"],
            ].filter(Boolean),
            passionBlurb: row["What do you wish to gain from being on a project? (aim for ~100 words)"] || "",
            portfolioLink: row["Do you have a Portfolio and/or CV? (insert a link here if so)"] || "",
            additionalInfo: row["Anything else you would like us to know?"] || "",
            execComments: row["EXEC INITIAL COMMENTS"] || "",
            rizzLevel: parseInt(row["EXEC RATING (0 to 5)"], 10) || 0,
          }));

          resolve(applicants);
        } catch (error) {
          reject(error);
        }
      },
      error: (error : Error) => {
        reject(error.message);
      },
    });
  });
};

export const parseCsvProjects = (filePath: string): Promise<Project[]> => {
  return new Promise((resolve, reject) => {
    const fileContent = fs.readFileSync(filePath, "utf8");

    Papa.parse(fileContent, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        try {
          const projects: Project[] = result.data.map((row: any, index: number) => ({
            id: row["name"],
            name: row["name"],
            backendDifficulty: row["backendDifficulty"],
            frontendDifficulty: row["frontendDifficulty"],
            backendWeighting: row["backendWeighting"],
            priority: row["Priority"]
          }));

          resolve(projects);
        } catch (error) {
          reject(error);
        }
      },
      error: (error : Error) => {
        reject(error.message);
      },
    });
  });
};

export const parseProcessedCsvApplicants = (filePath: string): Promise<Applicant[]> => {
  return new Promise((resolve, reject) => {
    const fileContent = fs.readFileSync(filePath, "utf8");

    Papa.parse(fileContent, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        try {
          const applicants: Applicant[] = result.data.map((row: any) => ({
            timestamp: new Date(row["timestamp"]), // Directly use the "timestamp" column
            id: row["id"], // Directly use the "id" column
            name: row["name"], // Directly use the "name" column
            email: row["email"], // Directly use the "email" column
            github: row["github"], // Directly use the "github" column
            major: row["major"], // Directly use the "major" column
            rolePreference: row["rolePreference"], // Directly use the "rolePreference" column
            skills: row["skills"]?.split(",").map((s: string) => s.trim()) || [], // Directly use the "skills" column
            backendPreference: parseInt(row["backendPreference"], 10) || 0, // Directly use the "backendPreference" column
            frontendExperience: parseInt(row["frontendExperience"], 10) || 0, // Directly use the "frontendExperience" column
            backendExperience: parseInt(row["backendExperience"], 10) || 0, // Directly use the "backendExperience" column
            designExperience: parseInt(row["designExperience"], 10) || 0, // Directly use the "designExperience" column
            testingExperience: parseInt(row["testingExperience"], 10) || 0, // Directly use the "testingExperience" column
            projectChoices: row["projectChoices"]?.split(",").map((choice: string) => choice.trim()) || [], // Split projectChoices string into array
            passionBlurb: row["passionBlurb"] || "", // Directly use the "passionBlurb" column
            portfolioLink: row["portfolioLink"] || "", // Directly use the "portfolioLink" column
            additionalInfo: row["additionalInfo"] || "", // Directly use the "additionalInfo" column
            execComments: row["execComments"] || "", // Directly use the "execComments" column
            rizzLevel: parseInt(row["rizzLevel"], 10) || 0, // Directly use the "rizzLevel" column
          }));

          resolve(applicants);
        } catch (error) {
          reject(error);
        }
      },
      error: (error: Error) => {
        reject(error.message);
      },
    });
  });
};

/**
 * Writes an array of objects to a CSV file.
 * @param data Array of objects to write to CSV.
 * @param filePath Output CSV file path.
 */

export const writeCsv = (data: unknown[], filePath: string): void => {
  const csv = Papa.unparse(data);
  fs.writeFileSync(filePath, csv, "utf8");
  console.log(`✅ CSV successfully written to ${filePath}`);
};