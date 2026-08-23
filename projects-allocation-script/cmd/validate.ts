import fs from "fs";
import path from "path";
import Papa from "papaparse";

import { allocationConfig, preprocessConfig } from "../config/scriptConfig.js";

console.log("[INFO] Starting validation of allocation results...\n");

const outputDir = path.dirname(allocationConfig.outputFileFormat);
const applicantsCsvPath = preprocessConfig.outputFile;

// Names of the preprocessing artifacts that live alongside the team CSVs
const preprocessArtifacts = [preprocessConfig.outputFileDesigners, preprocessConfig.outputFileFlagged].map((file) =>
	path.basename(file)
);

/**
 * Parses a CSV file into rows. Wrapped in a Promise so callers await completion
 * rather than relying on Papa.parse's callback happening to fire synchronously.
 */
function parseCsv(filePath: string): Promise<Record<string, string>[]> {
	return new Promise((resolve, reject) => {
		const fileContent = fs.readFileSync(filePath, "utf8");

		Papa.parse<Record<string, string>>(fileContent, {
			header: true,
			skipEmptyLines: true,
			complete: (result) => resolve(result.data),
			error: (error: Error) => reject(error),
		});
	});
}

// Check if output directory exists
if (!fs.existsSync(outputDir)) {
	console.error(`[ERROR] Output directory ${outputDir} not found`);
	process.exit(1);
}

// Load original applicants count
let totalOriginalApplicants = 0;
if (fs.existsSync(applicantsCsvPath)) {
	try {
		const rows = await parseCsv(applicantsCsvPath);
		totalOriginalApplicants = rows.length;
		console.log(`[INFO] Original applicants in ${applicantsCsvPath}: ${totalOriginalApplicants}\n`);
	} catch (error) {
		console.warn(`[WARN] Could not read original applicants count: ${error}`);
	}
}

// Read all CSV files from output directory, excluding preprocessing artifacts
const files = fs.readdirSync(outputDir).filter((file) => {
	return file.endsWith(".csv") && !preprocessArtifacts.includes(file);
});

if (files.length === 0) {
	console.error("[ERROR] No CSV files found in output directory");
	process.exit(1);
}

console.log(`[INFO] Found ${files.length} project files\n`);

// Track all applicants
const allApplicants: Map<number, { name: string; project: string }> = new Map();
const duplicates: { id: number; name: string; projects: string[] }[] = [];
const projectCounts: Map<string, number> = new Map();
let rowsWithoutValidId = 0;

// Parse each CSV file
for (const file of files) {
	const filePath = path.join(outputDir, file);
	const projectName = file.replace("applicants-", "").replace(".csv", "");

	let rows: Record<string, string>[];
	try {
		rows = await parseCsv(filePath);
	} catch (error) {
		console.error(`[ERROR] Failed to parse ${file}:`, error);
		continue;
	}

	projectCounts.set(projectName, rows.length);

	for (const row of rows) {
		const id = row.id !== undefined && row.id.trim() !== "" ? Number(row.id) : null;
		const name = row.name || "Unknown";

		// NaN must be rejected here: it would collapse every malformed row onto a
		// single Map key, hiding real duplicates and inflating the "allocated" count.
		if (id === null || !Number.isInteger(id)) {
			rowsWithoutValidId++;
			console.warn(`[WARN] Applicant without a valid ID in ${projectName}: ${name} (id: "${row.id}")`);
			continue;
		}

		// Check for duplicates
		if (allApplicants.has(id)) {
			const existing = allApplicants.get(id)!;
			const duplicate = duplicates.find((d) => d.id === id);
			if (duplicate) {
				duplicate.projects.push(projectName);
			} else {
				duplicates.push({
					id,
					name: existing.name,
					projects: [existing.project, projectName],
				});
			}
		} else {
			allApplicants.set(id, { name, project: projectName });
		}
	}
}

// Summary
console.log("\n========== VALIDATION RESULTS ==========\n");

console.log(`[INFO] Total unique applicants allocated: ${allApplicants.size}`);
if (totalOriginalApplicants > 0) {
	console.log(`[INFO] Total original applicants: ${totalOriginalApplicants}`);
	if (allApplicants.size === totalOriginalApplicants) {
		console.log(`[SUCCESS] All applicants have been allocated!`);
	} else {
		console.log(`[ERROR] Mismatch: ${totalOriginalApplicants - allApplicants.size} applicants are missing`);
	}
}
console.log(`[INFO] Total project files: ${projectCounts.size}`);

// Project distribution
console.log("\n[INFO] Project team sizes:");
const sortedProjects = Array.from(projectCounts.entries()).sort((a, b) => b[1] - a[1]);
for (const [project, count] of sortedProjects) {
	console.log(`  ${project}: ${count} applicants`);
}

// Check for duplicates
if (duplicates.length > 0) {
	console.log(`\n[ERROR] Found ${duplicates.length} duplicate applicants:`);
	for (const dup of duplicates) {
		console.log(`  ${dup.name} (ID: ${dup.id}) in projects: ${dup.projects.join(", ")}`);
	}
} else {
	console.log("\n[SUCCESS] No duplicates found - each person is in exactly one project");
}

if (rowsWithoutValidId > 0) {
	console.log(`\n[ERROR] ${rowsWithoutValidId} allocated rows had no valid ID and could not be checked`);
}

// Summary
const isValid = duplicates.length === 0 && rowsWithoutValidId === 0;
console.log(`\n========== SUMMARY ==========`);
console.log(`Total applicants allocated: ${allApplicants.size}`);
console.log(`Duplicate applicants: ${duplicates.length}`);
console.log(`Rows with invalid IDs: ${rowsWithoutValidId}`);
console.log(`Status: ${isValid ? "✅ VALID" : "❌ INVALID"}`);

if (!isValid) {
	process.exit(1);
}
