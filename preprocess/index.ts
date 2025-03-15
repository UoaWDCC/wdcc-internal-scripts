import path from "path";
import { parseRawCsvApplicants } from "../common/csvParser/parseRawCsvApplicants.js";
import { writeCsv } from "../common/csvParser/writeCsv.js";
import { config } from "../config.js";

console.log("Running preprocess script...");
const { inFile, outFile, outFileDesigners, outFileFlagged } = config.preprocess;

const outputApplicantCsvPath = path.resolve(outFile);
const outputDesignerCsvPath = path.resolve(outFileDesigners);
const outputFlaggedApplicantsCsvPath = path.resolve(outFileFlagged)
if (!inFile) {
  console.error("❌ Error: Please provide a CSV file path as an argument.");
  console.log("Usage: see config.js");
  process.exit(1);
}

// Convert backslashes to forward slashes, maybe theres a better way to do this.
// Nah looks good 👍
const inputCsvPath = inFile.replace(/\\/g, "/");

console.log(`Parsing CSV from: ${inputCsvPath}`);

const preProcess = async () => {
  try {
    let applicants = await parseRawCsvApplicants(inputCsvPath);


    if (!applicants || applicants.length === 0) {
      console.error("❌ No valid applicants data found.");
      return;
    }

    console.log(`✅ Successfully parsed ${applicants.length} applicants.`);

    const designers = applicants.filter(applicant => applicant.creativityHire?.toLowerCase() === "creative maybe" || applicant.creativityHire?.toLowerCase() === "creative guarantee");

    console.log(`There are ${designers.length} designers`)

    console.log("Filtering applicants based on if they have a passionBlurb < 100 char ")

    const flaggedApplicants = applicants.filter(applicant => (applicant.passionBlurb && applicant.passionBlurb.length < 100) || applicant.rizzLevel === 1);
    applicants = applicants.filter(applicant => (applicant.passionBlurb && applicant.passionBlurb.length >= 100) || applicant.rizzLevel === 1);

    console.log("Filtering applicants based on if they're a designer")
    applicants = applicants.filter(applicant => !designers.includes(applicant));

    console.log("Writing applicants to CSV...");
    writeCsv(applicants, outputApplicantCsvPath);

    console.log(`✅ Preprocess of applicants complete. Output saved to: ${outputApplicantCsvPath} 🚀`);

    console.log("Writing designers to csv")
    writeCsv(designers, outputDesignerCsvPath);

    console.log("Writing flaggedApplicants to csv")
    writeCsv(flaggedApplicants, outputFlaggedApplicantsCsvPath);

    console.log(`✅ Preprocess of designers complete. Output saved to: ${outputDesignerCsvPath} 🚀`);
  } catch (error) {
    console.error("❌ Error during CSV parsing:", error);
  }
};

preProcess()