import { Applicant } from "../models.js";
import fs from "fs";
import Papa from "papaparse";


export const writeCsv = (data: unknown[], filePath: string): void => {
    const csv = Papa.unparse(data);
    fs.writeFileSync(filePath, csv, "utf8");
    console.log(`✅ CSV successfully written to ${filePath}`);
  };