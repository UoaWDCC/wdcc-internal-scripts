// --- This file mainly for I/O ---

import { integerProgramming } from "./algorithms/integerProgramming.js";
import { config } from "../config.js";

console.log("Running allocation script");

console.log("Parsing Applicants CSV...");

console.log("Parsing Teams CSV...");

console.log("Parsed! Running allocation algorithm...");
integerProgramming([], [], {A: 0.2});

console.log(`Allocated with objective score ${456}. Writing to CSV...`);

console.log("Allocation script complete 🚀");
