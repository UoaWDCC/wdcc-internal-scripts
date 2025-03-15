### Pseudocode

```pseudocode
ProjectData[16]
ApplicantData[n] -> contains a list of preferences from 1 -> 5

class ProjectAllocation {
    "id": "project_id",
    "allocated": PriorityQueue<Contribution>
    "front_allocated": int,
    "back_allocated": int,
}

// priority queue based on with key, val pair of contribution, applicant

ApplicantQueue[n] // queue of unmatched applicants

for applicant in ApplicantQueue: 
    curr_choice = pop first choice from list of preferences
    contribution = calculate_contribution(applicant, curr_choice)
    if curr_choice pq is not full:
        add applicant to pq
    else:
        if applicant has higher contribution than lowest in pq:
            remove lowest from pq
            add applicant to pq
            add removed applicant to ApplicantQueue
        else:
            add applicant to ApplicantQueue

// helper function
def calculate_contribution(applicant, project):
    return front_multiplier(project) * applicant.front + back_multiplier(project) * applicant.back + project.priority * applicant.experience

def front_multiplier(project, alpha):
    return alpha * (project.front_capacity - project.front_allocated)

def back_multipler(project, beta):
    return beta * (project.back_capacity - project.back_allocated)
```
