# How to use these scripts

### Prod

- Configure `config.ts`
- `pnpm build`
- Add `team-preference.csv` (TODO: examples)
- `pnpm run preprocess`: runs the preprocessing script
  - Input: raw applicants
  - Output: applicants in the right format
- `pnpm run filter`: runs the filter script
  - Input: (formatted) applicants
  - Output: accepted applicants + rejected applicants
- `pnpm run allocate`:
  - Input: accepted applicants & team preferences
  - Output: applicants, split into teams (1 CSV per team)

I/O is always as a CSV.

### Dev

- `pnpm install`
- `pnpm dev` (leave this running to constantly compile TS to JS)
- `pnpm p`, `pnpm f` & `pnpm a` are aliases for `preprocess`, `filter` & `allocate`

# Docs

- [Diagram](https://docs.google.com/presentation/d/1asrbZzug_n_-MIe_ZhA7y4cox-eepl_fYMhqdov0xv4/edit#slide=id.p)
- Contact tech@wdcc.co.nz for help