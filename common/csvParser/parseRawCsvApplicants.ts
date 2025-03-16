import { Applicant } from "../models.js";
import fs from "fs";
import Papa from "papaparse";
import { mapExperience } from "./helper/mapExperience.js";

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
            id: index,
            name: row["What is your full name?"],
            email: row["Email address?"],
            github: row["What is your GitHub username?"],
            major: row["What do you study? (Degree: major)"],
            rolePreference: row["Role preference"],
            skills: row["Previous technical experience"]?.split(",").map((s: string) => s.trim()) || [],
            backendPreference: parseInt(row["What kind of work do you have a higher preference towards learning/doing within projects?"]),
            frontendExperience: mapExperience(row["How would you rate your experience level in the following areas? [Front-end dev]"]),
            backendExperience: mapExperience(row["How would you rate your experience level in the following areas? [Back-end dev]"]),
            designExperience: mapExperience(row["How would you rate your experience level in the following areas? [Design]"]),
            testingExperience: mapExperience(row["How would you rate your experience level in the following areas? [Testing]"]),
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
            creativityHire: row["CREATIVITY HIRE (manual Design/Design-dev allocation)"]
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
