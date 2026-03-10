import fs from "fs";
import path from "path";
import Papa from "papaparse";

export const writeCsv = (data: unknown[], filePath: string): void => {
    // Check if the directory exists, create it if not
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    const csv = Papa.unparse(data);
    fs.writeFileSync(filePath, csv, "utf8");
    console.log(`✅ CSV successfully written to ${filePath}`);
};
