import fs from "fs";
import path from "path";
import Papa from "papaparse";

console.log("[INFO] Starting validation of allocation results...\n");

const outputDir = "./data/out";
const applicantsCsvPath = "./data/processedApplicants.csv";

// Check if output directory exists
if (!fs.existsSync(outputDir)) {
	console.error(`[ERROR] Output directory ${outputDir} not found`);
	process.exit(1);
}

// Load original applicants count
let totalOriginalApplicants = 0;
if (fs.existsSync(applicantsCsvPath)) {
	const fileContent = fs.readFileSync(applicantsCsvPath, "utf8");
	Papa.parse<Record<string, string>>(fileContent, {
		header: true,
		skipEmptyLines: true,
		complete: (result) => {
			totalOriginalApplicants = result.data.length;
			console.log(`[INFO] Original applicants in processedApplicants.csv: ${totalOriginalApplicants}\n`);
		},
		error: (error: any) => {
			console.warn(`[WARN] Could not read original applicants count: ${error}`);
		},
	});
}

// Read all CSV files from output directory, excluding preprocessing artifacts
const files = fs.readdirSync(outputDir).filter((file) => {
	return file.endsWith(".csv") && 
		   !file.includes("flaggedApplicants") && 
		   !file.includes("designers");
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

// Parse each CSV file
for (const file of files) {
	const filePath = path.join(outputDir, file);
	const projectName = file.replace("applicants-", "").replace(".csv", "");

	const fileContent = fs.readFileSync(filePath, "utf8");

	Papa.parse<Record<string, string>>(fileContent, {
		header: true,
		skipEmptyLines: true,
		complete: (result) => {
			const applicantCount = result.data.length;
			projectCounts.set(projectName, applicantCount);

			for (const row of result.data) {
				// Extract ID and name (adjust column names as needed)
				const id = row.id ? parseInt(row.id) : null;
				const name = row.name || "Unknown";

				if (id === null || id === undefined) {
					console.warn(`[WARN] Applicant without ID in ${projectName}: ${name}`);
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
		},
		error: (error: any) => {
			console.error(`[ERROR] Failed to parse ${file}:`, error);
		},
	});
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

// Summary
const totalAllocated = allApplicants.size;
console.log(`\n========== SUMMARY ==========`);
console.log(`Total applicants allocated: ${totalAllocated}`);
console.log(`Duplicate applicants: ${duplicates.length}`);
console.log(`Status: ${duplicates.length === 0 ? "✅ VALID" : "❌ INVALID"}`);

if (duplicates.length > 0) {
	process.exit(1);
}
