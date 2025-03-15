import { parseRawCsvApplicants } from "../common/csvParser/parseRawCsvApplicants.js";
import { writeCsv } from "../common/csvParser/writeCsv.js";
import path from "path";

console.log("Running preprocess script...");


let inputCsvPath = process.argv[2]; 
const outputApplicantCsvPath = path.resolve("./data/processedApplicants.csv");
const outputDesignerCsvPath = path.resolve("./data/designers.csv");
const outputFlaggedApplicantsCsvPath = path.resolve("./data/flaggedApplicants.csv")
if (!inputCsvPath) {
  console.error("❌ Error: Please provide a CSV file path as an argument.");
  console.log("Usage: node dist/preprocess/index.js <path_to_csv>");
  process.exit(1);
}

// (convert backslashes to forward slashes, maybe theres a better way to do this.)

inputCsvPath = inputCsvPath.replace(/\\/g, "/");

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

    const flaggedApplicants = applicants.filter(applicant => applicant.passionBlurb && applicant.passionBlurb.length < 100);
    applicants = applicants.filter(applicant => applicant.passionBlurb && applicant.passionBlurb.length >= 100);
    
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