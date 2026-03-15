import path from "path";

import { parseApplicantsCsv } from "../csv/parseApplicants.js";
import { writeCsv } from "../csv/writeCsv.js";
import { preprocessConfig } from "../config/scriptConfig.js"

console.log("[INFO] Running preprocess script...");

const { inputFile, outputFile, outputFileDesigners, outputFileFlagged } = preprocessConfig
const outputApplicantCsvPath = path.resolve(outputFile);
const outputDesignerCsvPath = path.resolve(outputFileDesigners);
const outputFlaggedApplicantsCsvPath = path.resolve(outputFileFlagged);

if (!inputFile) {
    console.error("[ERROR] Please provide the input CSV file path inside /config/scriptConfig.ts")
    process.exit(1);
}
const inputCsvPath = inputFile.replace(/\\/g, "/");

console.log(`[INFO] Parsing CSV from: ${inputCsvPath}`);

let applicants = await parseApplicantsCsv(inputCsvPath, true);
if (!applicants || applicants.length === 0) {
	console.error("[ERROR] No valid applicants data found.");
    process.exit(1);
}

console.log(`[SUCCESS] Successfully parsed ${applicants.length} applicants.`);

const designers = applicants.filter(applicant => applicant.rolePreference === "Designer")
console.log(`[INFO] There are ${designers.length} designers`);

console.log("========");

console.log("[INFO] Filtering applicants based on if they have a passionBlurb < 100 char");
const flaggedApplicants = applicants.filter(
	(applicant) => (applicant.passionBlurb && applicant.passionBlurb.length < 100)
);

console.log("[INFO] Filtering applicants based on if they're a designer");
applicants = applicants.filter(applicant => applicant.rolePreference !== "Designer")

console.log("[INFO] Writing applicants to CSV...");
writeCsv(applicants, outputApplicantCsvPath);

console.log(`[SUCCESS] Preprocess of applicants complete. Output saved to: ${outputApplicantCsvPath}`);

console.log("[INFO] Writing designers to csv");
writeCsv(designers, outputDesignerCsvPath);

console.log("[INFO] Writing flaggedApplicants to csv");
writeCsv(flaggedApplicants, outputFlaggedApplicantsCsvPath);

console.log(`[SUCCESS] Preprocess of designers complete. Output saved to: ${outputDesignerCsvPath}`);
console.log("[INFO] Finished preprocessing")
