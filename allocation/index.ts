// --- This file mainly for I/O ---

import { parseProcessedCsvApplicants } from "../common/csvParser/parseCsvProcessedApplicants.js";
import { parseCsvProjects } from "../common/csvParser/parseCsvProjects.js";
import { writeCsv } from "../common/csvParser/writeCsv.js";
import { config } from "../config.js";
import { stableMatching } from "./algorithms/stableMatching.js";
import { calculateTotalUtility } from "./helper/objective.js";

const allocate = async() => {
  console.log("Running allocation script");
  const {A, B, C, D, inFileApplicants, inFileTeams, outFileFormat} = config.allocation;

  // Input
  console.log("Parsing Applicants CSV...");
  const applicants = await parseProcessedCsvApplicants(inFileApplicants);
  console.log("Parsing Projects CSV...");
  const projectsData =  await parseCsvProjects(inFileTeams);

  // Algorithm
  console.log("Parsed! Running allocation algorithm...");
  const allocations = stableMatching(applicants, projectsData);

  const finalObjectiveScore = calculateTotalUtility(allocations, A, B, C, D);
  console.log(`Allocated ${allocations.length} projects! Objective score: ${finalObjectiveScore}`);

  // Output
  console.log(`Writing to CSVs...`);
  allocations.forEach((allocation) => {
    const safeProjectName = allocation.project.name.replace(/[\\/:.]/, '_');
    console.log(`${safeProjectName} (${allocation.project.id}) has ${allocation.applicants.length} applicants.`)
    const outFileName = outFileFormat.replace('<team>', safeProjectName);
    writeCsv(allocation.applicants, outFileName);
  })

  console.log("Allocation script complete 🚀");
}

allocate();
