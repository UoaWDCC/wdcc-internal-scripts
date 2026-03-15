import { Allocation } from "../../common/types.js";
import { calculateUtilityOfAllocation } from "../helper/objective.js";

function testCalculateUtilityOfAllocation() {
    const allocation: Allocation = {
        project: {
            id: 1,
            name: "A",
            backendDifficulty: 4,
            frontendDifficulty: 5,
            backendWeighting: 4,
            experienceWeighting: 0,
        },
        applicants: [
            {
                timestamp: new Date(),
                id: 0,
                name: "",
                email: "",
                github: "",
                major: "",
                rolePreference: "",
                skills: [],
                backendPreference: 0,
                frontendExperience: 0,
                backendExperience: 0,
                designExperience: 0,
                testingExperience: 0,
                projectChoices: ["A", "B", "C", "D", "E"],
                passionBlurb: "",
                portfolioLink: "",
				cvLink: "",
				jobContact: "",
                additionalInfo: "",
            },
            {
                timestamp: new Date(),
                id: 1,
                name: "",
                email: "",
                github: "",
                major: "",
                rolePreference: "",
                skills: [],
                backendPreference: 0,
                frontendExperience: 0,
                backendExperience: 0,
                designExperience: 0,
                testingExperience: 0,
                projectChoices: ["D", "B", "C", "A", "E"],
                passionBlurb: "",
                portfolioLink: "",
				cvLink: "",
				jobContact: "",
                additionalInfo: "",
            },
            {
                timestamp: new Date(),
                id: 2,
                name: "",
                email: "",
                github: "",
                major: "",
                rolePreference: "",
                skills: [],
                backendPreference: 0,
                frontendExperience: 0,
                backendExperience: 0,
                designExperience: 0,
                testingExperience: 0,
                projectChoices: ["F", "B", "C", "D", "A"],
                passionBlurb: "",
                portfolioLink: "",
				cvLink: "",
				jobContact: "",
                additionalInfo: "",
            },
        ],
    };

    const expectedUtility = 8;
    const actualUtility = calculateUtilityOfAllocation(allocation);

    console.log(`testCalculateUtilityOfAllocation: expected ${expectedUtility}, got ${actualUtility}`);
}

testCalculateUtilityOfAllocation();
