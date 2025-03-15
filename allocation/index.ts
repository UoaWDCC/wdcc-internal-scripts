// --- This file mainly for I/O ---

import { parseCsvProjects } from "../common/csvParser/parseCsvProjects.js";
import { parseProcessedCsvApplicants } from "../common/csvParser/parseCsvProcessedApplicants.js";
import { stableMatching } from "./algorithms/stableMatching.js";

const Allocation = async() => {
    const projectsDataLocation = "./data/projectsData.csv"
    const applicantsDataLocation = "./data/processedApplicants.csv" // get processed applicants
    console.log("Running allocation script");

    console.log("Parsing Applicants CSV...");
    const applicants = await parseProcessedCsvApplicants(applicantsDataLocation)
    console.log(applicants.slice(0,3 ))
    
    console.log("Parsing Projects CSV...");
    const projectsData =  await parseCsvProjects(projectsDataLocation)
    console.log(projectsData.slice(0,3 ))

    console.log("Parsed! Running allocation algorithm...");
    const res = stableMatching(applicants, projectsData)
    console.log(res)
    console.log(`Allocated ${res.length} projects! Writing to CSV...`);

    console.log("Allocation script complete 🚀");
}

Allocation()
