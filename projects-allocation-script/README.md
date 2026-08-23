# How to use these scripts

## New Folder Structure (introduced 2026)

```
cmd/                        // main entrypoint folder
    preprocess.ts           // -> script to preprocess applicants
    allocate.ts             // -> script to do the allocation
    validate.ts             // -> script to sanity-check the allocation output
allocation/                 // main allocation folder
    algorithms/             // -> contains all the algorithms hehe
    helper/                 // -> helper functions for the algorithms
csv/                        // csv parser folder
config/                     // main config folder
    scriptConfig.ts         // -> file paths + algorithm coefficients
    csvMappings.ts          // -> csv column mappings
common/                     // any common utils/types
    types.ts
```

Data [here](https://drive.google.com/drive/u/2/folders/1YmywtfQkJ557tyt6pU41PSGSBSShB9jG) (download both sheets as CSVs).

### Prod

- Configure `config/scriptConfig.ts` (file paths, coefficients) and `config/csvMappings.ts` (form column headers)
- `pnpm build`
- Add `team-preference.csv` (TODO: examples)
- `pnpm run preprocess`: runs the preprocessing script
    - Input: raw applicants
    - Output: accepted applicants + flagged applicants + designers, formatted correctly
    - Flagged applicants (passion blurb < 100 chars) are held back for exec review and are **not** passed to allocation
- `pnpm run allocate`:
    - Input: accepted applicants & team preferences
    - Output: applicants, split into teams (1 CSV per team)
    - Algorithm: `stableMatching` (deferred-acceptance style) followed by `heuristicAscent` (local-search swap optimisation)
- `pnpm run validate`: checks the allocation output for duplicates, missing applicants, and invalid IDs. Exits non-zero if invalid.

I/O is always as a CSV.

### Dev

- `pnpm install`
- `pnpm dev` (leave this running to constantly compile TS to JS)
- `pnpm p`, `pnpm a` & `pnpm v` are aliases for `preprocess`, `allocate` & `validate`
- There is currently no test suite (the old one was removed alongside the config refactor)

# Docs

- [Diagram](https://docs.google.com/presentation/d/1asrbZzug_n_-MIe_ZhA7y4cox-eepl_fYMhqdov0xv4/edit#slide=id.p)
- Contact tech@wdcc.co.nz for help
