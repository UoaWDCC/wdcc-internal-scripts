import fs from "fs";
import Papa from "papaparse";

import { Project } from "../common/types.js";
import { PROJECT_COLUMNS } from "../config/csvMappings.js";

/**
 * Parses a CSV file and returns an array of Project objects.
 * @param filePath Path to the CSV file.
 * @returns Promise resolving to an array of Project objects.
 */
export const parseCsvProjects = (filePath: string): Promise<Project[]> => {
    return new Promise((resolve, reject) => {
        const fileContent = fs.readFileSync(filePath, "utf8");

        Papa.parse<Record<string, string>>(fileContent, {
            header: true,
            skipEmptyLines: true,
            complete: (result) => {
				const projects: Project[] = result.data.flatMap((row: Record<string, string>, index: number) => {
					try {
						return [{
							id: index,
							name: row[PROJECT_COLUMNS.name],
							backendWeighting: Number(row[PROJECT_COLUMNS.backendWeighting]),
							frontendDifficulty: Number(row[PROJECT_COLUMNS.frontendDifficulty]),
							backendDifficulty: Number(row[PROJECT_COLUMNS.backendDifficulty]),
							experienceWeighting: Number(row[PROJECT_COLUMNS.experienceWeighting]),
						}]
					} catch (error) {
						console.error(`index:${index} - parsing error: ${error}`)
						return []
					}
				});

				resolve(projects);
            },
            error: (error: Error) => {
                reject(error.message);
            },
        });
    });
};
