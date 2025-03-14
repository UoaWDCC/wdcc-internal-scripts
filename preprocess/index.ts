import { parseRawCsvApplicants, writeCsv } from "../common/csvParser.js";
import path from "path";

console.log("Running preprocess script...");


let inputCsvPath = process.argv[2]; 
const outputCsvPath = path.resolve("./data/processed_applicants.csv");

if (!inputCsvPath) {
  console.error("❌ Error: Please provide a CSV file path as an argument.");
  console.log("Usage: node dist/preprocess/index.js <path_to_csv>");
  process.exit(1);
}

// (convert backslashes to forward slashes)

inputCsvPath = inputCsvPath.replace(/\\/g, "/");

console.log(`Parsing CSV from: ${inputCsvPath}`);

const preProcess = async () => {
  try {
    const applicants = await parseRawCsvApplicants(inputCsvPath);
    
   
    if (!Array.isArray(applicants) || applicants.length === 0) {
      console.error("❌ No valid applicants data found.");
      return;
    }

    console.log(`✅ Successfully parsed ${applicants.length} applicants.`);
    console.log(applicants.slice(0, 3)); // temp show sample of applicants

    console.log("Writing to CSV...");
    writeCsv(applicants, outputCsvPath);

    console.log(`✅ Preprocess complete. Output saved to: ${outputCsvPath} 🚀`);
  } catch (error) {
    console.error("❌ Error during CSV parsing:", error);
  }
};

preProcess()