// --- This file mainly for I/O ---
import { randomlyAllocate } from "../allocation/helper/random.js";
import { logAllocationRankingList } from "../allocation/helper/utils.js";
import { parseCsvProjects } from "../csv/parseCsvProjects.js";
import { writeCsv } from "../csv/writeCsv.js";
import { allocationConfig } from "../config/scriptConfig.js"
import { parseApplicantsCsv } from "../csv/parseApplicants.js";
import { Allocation, Applicant, Project } from "../common/types.js";
import { stableMatching } from "../allocation/algorithms/stableMatching.js";
import { heuristicAscent } from "../allocation/algorithms/heuristicAscent.js";

console.log("[INFO] Running allocation script")
const { inputFileApplicants, inputFileProjects, outputFileFormat } = allocationConfig

console.log("[INFO] Parsing Applicants CSV...");
const applicants: Applicant[] = await parseApplicantsCsv(inputFileApplicants, false);
console.log("[INFO] Parsing Projects CSV...");
const projects: Project[] = await parseCsvProjects(inputFileProjects);

// Algorithm
console.log("[INFO] Parsed! Running allocation algorithm...");
const stableAllocation = stableMatching(applicants, projects)
const finalAllocation = heuristicAscent(() => stableAllocation);
const randomAllocations = randomlyAllocate(projects, applicants);
logAllocationRankingList(finalAllocation, randomAllocations);

// Output
console.log(`[INFO] Writing to CSVs...`);
finalAllocation.forEach((allocation: Allocation) => {
	const safeProjectName = allocation.project.name.replace(/[\\/:.]/g, "_");
	console.log(`[INFO] ${safeProjectName} (${allocation.project.id}) has ${allocation.applicants.length} applicants.`);
	const outFileName = outputFileFormat.replace("<team>", safeProjectName);
	writeCsv(allocation.applicants, outFileName);
});

console.log("[INFO] Allocation script complete");
