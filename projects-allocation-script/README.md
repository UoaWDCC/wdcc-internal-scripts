# How to use these scripts

Data [here](https://drive.google.com/drive/u/2/folders/1YmywtfQkJ557tyt6pU41PSGSBSShB9jG) (download both sheets as CSVs).

### Prod

- Configure `config.ts`
- `pnpm build`
- Add `team-preference.csv` (TODO: examples)
- `pnpm run preprocess`: runs the preprocessing script
  - Input: raw applicants
  - Output: accepted applicants + rejected applicants + designers, formatted correctly
- `pnpm run allocate`:
  - Input: accepted applicants & team preferences
  - Output: applicants, split into teams (1 CSV per team)

I/O is always as a CSV.

### Dev

- `pnpm install`
- `pnpm dev` (leave this running to constantly compile TS to JS)
- `pnpm p` & `pnpm a` are aliases for `preprocess` & `allocate`

# Docs

- [Diagram](https://docs.google.com/presentation/d/1asrbZzug_n_-MIe_ZhA7y4cox-eepl_fYMhqdov0xv4/edit#slide=id.p)
- Contact tech@wdcc.co.nz for help