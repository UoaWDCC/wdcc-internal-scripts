import fs from "fs";
import Papa from "papaparse";

import { Project } from "../common/types.js";
import { PROJECT_COLUMNS } from "../config/csvMappings.js";

/**
 * Parses a numeric project field, throwing if it isn't a number.
 * Prevents NaN from silently propagating into the allocation maths.
 */
function parseNumericField(field: string, value: string): number {
    const num = Number(value);
    if (value === undefined || value.trim() === "" || Number.isNaN(num)) {
        throw new Error(`invalid ${field}: "${value}"`);
    }
    return num;
}

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
				let dropped = 0;
				const projects: Project[] = result.data.flatMap((row: Record<string, string>, index: number) => {
					try {
						return [{
							id: index,
							name: row[PROJECT_COLUMNS.name],
							backendWeighting: parseNumericField("backendWeighting", row[PROJECT_COLUMNS.backendWeighting]),
							frontendDifficulty: parseNumericField("frontendDifficulty", row[PROJECT_COLUMNS.frontendDifficulty]),
							backendDifficulty: parseNumericField("backendDifficulty", row[PROJECT_COLUMNS.backendDifficulty]),
							experienceWeighting: parseNumericField("experienceWeighting", row[PROJECT_COLUMNS.experienceWeighting]),
						}]
					} catch (error) {
						dropped++
						console.error(`index:${index} - parsing error: ${error}`)
						return []
					}
				});

				if (dropped > 0) {
					console.warn(`[WARN] Dropped ${dropped} of ${result.data.length} rows from ${filePath} due to parsing errors`)
				}
				resolve(projects);
            },
            error: (error: Error) => {
                reject(error.message);
            },
        });
    });
};
