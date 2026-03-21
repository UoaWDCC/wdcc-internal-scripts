import fs from "fs";
import Papa from "papaparse";

import { Applicant } from "../common/types.js";
import { APPLICANT_COLUMNS, EXPERIENCE_MAPPING } from "../config/csvMappings.js";

/**
 * Parses a CSV file and returns an array of Applicant objects.
 * @param filePath Path to the CSV file.
 * @param raw Whether or not the CSV file is raw (true) or processed (false)
 * @returns Promise resolving to an array of Applicant objects.
 */
export function parseApplicantsCsv(filePath: string, raw: boolean): Promise<Applicant[]> {
	return new Promise((resolve, reject) => {
		const fileContent = fs.readFileSync(filePath, "utf8");

		Papa.parse<Record<string, string>>(fileContent, {
			header: true,
			skipEmptyLines: true,
			complete: (result) => {
				const applicants: Applicant[] = result.data.flatMap((row: Record<string, string>, index: number) => {
					try {
						if (raw) {
							return [{
								id: index,
								timestamp: new Date(row[APPLICANT_COLUMNS.timestamp]),
								name: row[APPLICANT_COLUMNS.name],
								email: row[APPLICANT_COLUMNS.email],
								major: row[APPLICANT_COLUMNS.major],
								rolePreference: row[APPLICANT_COLUMNS.rolePreference],
								github: row[APPLICANT_COLUMNS.github],
								skills: row[APPLICANT_COLUMNS.skills].split(",").map((s: string) => s.trim()) || [],
								backendPreference: Number(row[APPLICANT_COLUMNS.backendPreference]),
								portfolioLink: row[APPLICANT_COLUMNS.portfolioLink],
								frontendExperience: EXPERIENCE_MAPPING[row[APPLICANT_COLUMNS.frontendExperience]],
								backendExperience: EXPERIENCE_MAPPING[row[APPLICANT_COLUMNS.backendExperience]],
								designExperience: EXPERIENCE_MAPPING[row[APPLICANT_COLUMNS.designExperience]],
								testingExperience: EXPERIENCE_MAPPING[row[APPLICANT_COLUMNS.testingExperience]],
								projectChoices: [
									row[APPLICANT_COLUMNS.firstChoice],
									row[APPLICANT_COLUMNS.secondChocie],
									row[APPLICANT_COLUMNS.thirdChoice],
									row[APPLICANT_COLUMNS.fourthChoice],
									row[APPLICANT_COLUMNS.fifthChoice],
								].filter(Boolean),
								passionBlurb: row[APPLICANT_COLUMNS.passionBlurb],
								cvLink: row[APPLICANT_COLUMNS.cvLink],
								jobContact: row[APPLICANT_COLUMNS.jobContact],
								additionalInfo: row[APPLICANT_COLUMNS.additionalInfo],
								execComments: row[APPLICANT_COLUMNS.execComments],
							}]
						} else {
							return [{
								id: Number(row["id"]),
								timestamp: new Date(row["timestamp"]),
								name: row["name"],
								email: row["email"],
								major: row["major"],
								rolePreference: row["rolePreference"],
								github: row["github"],
								skills: row["skills"].split(",").map((s: string) => s.trim()) || [],
								backendPreference: Number(row["backendPreference"]),
								portfolioLink: row["portfolioLink"],
								frontendExperience: Number(row["frontendExperience"]),
								backendExperience: Number(row["backendExperience"]),
								designExperience: Number(row["designExperience"]),
								testingExperience: Number(row["testingExperience"]),
								projectChoices: row["projectChoices"].split(",").map((s: string) => s.trim()) || [],
								passionBlurb: row["passionBlurb"],
								cvLink: row["cvLink"],
								jobContact: row["jobContact"],
								additionalInfo: row["additionalInfo"],
								execComments: row["execComments"],
							}]
						}
					} catch (error) {
						console.error(`index:${index} - parsing error: ${error}`)
						return []
					}
				})
				resolve(applicants)
			},
			error: (error: Error) => {
				reject(error.message);
			}
		})
	})
}
