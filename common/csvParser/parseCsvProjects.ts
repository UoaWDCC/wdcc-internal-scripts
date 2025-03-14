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
