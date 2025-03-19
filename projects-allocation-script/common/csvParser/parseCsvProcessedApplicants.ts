
import fs from "fs";
import Papa from "papaparse";
import { Applicant } from "../models.js";

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
            id: parseInt(row["id"]), // Directly use the "id" column
            name: row["name"], // Directly use the "name" column
            email: row["email"], // Directly use the "email" column
            github: row["github"], // Directly use the "github" column
            major: row["major"], // Directly use the "major" column
            rolePreference: row["rolePreference"], // Directly use the "rolePreference" column
            skills: row["skills"]?.split(",").map((s: string) => s.trim()) || [], // Directly use the "skills" column
            backendPreference: parseInt(row["backendPreference"], 10),
            frontendExperience: parseInt(row["frontendExperience"], 10),
            backendExperience: parseInt(row["backendExperience"], 10),
            designExperience: parseInt(row["designExperience"], 10),
            testingExperience: parseInt(row["testingExperience"], 10),
            projectChoices: row["projectChoices"]?.split(",").map((choice: string) => choice.trim()) || [], // Split projectChoices string into array
            passionBlurb: row["passionBlurb"] || "",
            portfolioLink: row["portfolioLink"] || "",
            additionalInfo: row["additionalInfo"] || "",
            execComments: row["execComments"] || "",
            rizzLevel: parseInt(row["rizzLevel"], 10) || 0,
            creativityHire: row["creativityHire"],
            requestedProject: row["requestedProject"],
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
