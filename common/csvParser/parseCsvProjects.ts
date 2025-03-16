import { Project } from "../models.js";
import fs from "fs";
import Papa from "papaparse";


export const parseCsvProjects = (filePath: string): Promise<Project[]> => {
  return new Promise((resolve, reject) => {
    const fileContent = fs.readFileSync(filePath, "utf8");

    Papa.parse(fileContent, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        try {
          const projects: Project[] = result.data.map((row: any, index: number) => ({
            id: index,
            name: row["What is the name of your project?"],
            backendDifficulty: row["How difficult do you expect your backend development to be?"],
            frontendDifficulty: row["How difficult do you expect your frontend development to be?"],
            backendWeighting: row["What's the backend-frontend weighting of your project?"],
            priority: row["What's your preference for beginners vs experienced members?"]
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
