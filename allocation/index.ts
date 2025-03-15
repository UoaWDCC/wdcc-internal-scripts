// --- This file mainly for I/O ---

import { parseProcessedCsvApplicants } from "../common/csvParser/parseCsvProcessedApplicants.js";
import { parseCsvProjects } from "../common/csvParser/parseCsvProjects.js";
import { config } from "../config.js";
import { stableMatching } from "./algorithms/stableMatching.js";
import { calculateTotalUtility } from "./helper/objective.js";

const allocate = async() => {
  const projectsDataLocation = "./data/projectsData.csv"
  const applicantsDataLocation = "./data/processedApplicants.csv" // get processed applicants
  console.log("Running allocation script");
  const {A, B, C, D} = config.allocation;

  console.log("Parsing Applicants CSV...");
  const applicants = await parseProcessedCsvApplicants(applicantsDataLocation)

  console.log("Parsing Projects CSV...");
  const projectsData =  await parseCsvProjects(projectsDataLocation)


  console.log("Parsed! Running allocation algorithm...");
  const allocations = stableMatching(applicants, projectsData)
  const finalObjectiveScore = calculateTotalUtility(allocations, A, B, C, D)

  console.log(`Allocated ${allocations.length} projects! Objective score: ${finalObjectiveScore}`);
  console.log(`Writing to CSVs...`);

  console.log("Allocation script complete 🚀");
}

allocate();
