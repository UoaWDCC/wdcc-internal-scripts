// --- This file mainly for I/O ---
import { powerOfFriendship } from "../allocation/algorithms/powerOfFriendship.js";
import { randomlyAllocate } from "../allocation/helper/random.js";
import { logAllocationRankingList } from "../allocation/helper/utils.js";
import { parseCsvProjects } from "../csv/parseCsvProjects.js";
import { writeCsv } from "../csv/writeCsv.js";
import { allocationConfig } from "../config/scriptConfig.js"
import { parseApplicantsCsv } from "../csv/parseApplicants.js";
import { Applicant, Project } from "../common/types.js";

console.log("[INFO] Running allocation script")
const { inputFileApplicants, inputFileProjects, outputFileFormat } = allocationConfig

console.log("[INFO] Parsing Applicants CSV...");
const applicants: Applicant[] = await parseApplicantsCsv(inputFileApplicants, false);
console.log("Parsing Projects CSV...");
const projectsData: Project[] = await parseCsvProjects(inputFileProjects);

// Algorithm
console.log("Parsed! Running allocation algorithm...");
const allocations = powerOfFriendship(applicants, projectsData);
const randomAllocations = randomlyAllocate(projectsData, applicants);
logAllocationRankingList(allocations, randomAllocations);

// Output
console.log(`Writing to CSVs...`);
allocations.forEach((allocation) => {
	const safeProjectName = allocation.project.name.replace(/[\\/:.]/, "_");
	console.log(`${safeProjectName} (${allocation.project.id}) has ${allocation.applicants.length} applicants.`);
	const outFileName = outputFileFormat.replace("<team>", safeProjectName);
	writeCsv(allocation.applicants, outFileName);
});

console.log("Allocation script complete 🚀");
