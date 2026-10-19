---
name: milepost-audit
description: Audits a whole repository from an outsider's view. Agents that never saw the development conversation first check the milepost plan, if there is one (whether a better option existed for the proposal's and each finished milestone's decisions, whether they left problems, whether they were done as the documents say), then map the code, the promises it makes and its trust boundaries, and review it. Use when the developer asks to audit or review the whole repository, often partway through a milepost plan. Not for one diff or pull request (use code-review) or a deep security scan (use claude-security).
---

# Repository audit

**An outside view of the whole repository.** milepost's review points show what the development session says it did. An audit has agents that never saw that conversation check the plan's decisions against the commits, then read the code itself, starting from what the project promises and where outside data comes in. It finds and reports; fixes go through the milestone map.

## Stay out of the judging

This skill usually runs in the conversation that built the code, so that conversation is the one view the audit must not inherit. Here you only pick the target, count, ask, call the agents and put what they wrote into the report. Never pass an agent a summary of the conversation, your opinion of the code or hints about known problems. Each agent gets exactly what its step lists.

## 1. Target and output

- **Target:** the git top-level folder (`git rev-parse --show-toplevel`).
- **Folder:** `milepost/notes/<slug>/A<n>-audit/`, where `<slug>` is the current goal's slug in `milepost/state.json`, or `audit` when there is none (an older `docs/reports/state.json` does not count), and `A<n>` is the next unused number in that folder.
- **Start time:** note it, for the report.
- **Revision:** `git rev-parse --short HEAD`, plus `dirty` if `git status --porcelain` shows changes outside `milepost/`.
- **Resume:** if the developer points at an existing `A<n>-audit` folder, use it and start at the first step whose output is missing or incomplete (`map.md`, a process findings file, a lens's findings file, a finding without a verdict, `triage.md`, the report), and redo only what is missing.

## 2. Scope

Start from the tracked text files (`git grep -I -l ''`) and leave out:

- `milepost/`: the development session's own documents and earlier audits. Reading them would hand the code agents the session's view; only the process step reads the state file and the current goal's documents, as claims to check. The same goes for `docs/reports/` when it holds a `state.json` (milepost's older layout).
- dependency and build output folders (`node_modules`, `vendor`, `third_party`, `dist`, `build`, `bin`, `obj` and the like);
- anything else the developer names; add back what they name.

Count the files, lines and kilobytes left.

## 3. Confirm

Tell the developer the target, revision, scope (files, lines, KB), what was left out, the process targets when there is a milepost plan (step 5), the lenses to run (all five in `LENSES.md` beside this file unless the developer names some) and a rough cost estimate, said to be rough. Say that the verify step may run commands, but only in a temporary copy under the system temp folder and with tools already installed, never changing anything else on the machine. Ask once whether to go ahead or change the scope. Skip the question when the request already accepts the scope and cost.

## 4. Map

Call the `milepost:audit-recon` agent with the target folder, the excluded paths, the revision line and the map path `<folder>/map.md`, and nothing else.

Check that `map.md` has its seven sections and that promises and claims carry sources before going on.

## 5. Process

Skip this step when `milepost/state.json` does not exist. Otherwise the targets are the current goal's proposal (PR), the milestones that have a design document in `milepost/html/<slug>/`, in map order and in batches of up to four (MS), and the map changes (MC). Call one `milepost:audit-process` agent per target or batch, all in one message. Give each the target folder, the revision line, the path of `milepost/state.json`, the documents folder `milepost/html/<slug>/`, its target (`PR`, `MS` with its milestone IDs, or `MC`), the absolute path of `PROCESS.md` beside this file and the findings path `<folder>/process/<PR | MS1 | MS2 … | MC>.md`, and nothing else.

Check that each findings file exists and that every finding has its Target, Question, Kind, Claim, Evidence, Knowable then, Paths and Map effect lines; call an agent again if its file is missing.

## 6. Lenses

Call one `milepost:audit-lens` agent per lens, all in one message so they run in parallel. Give each the target folder, the excluded paths, the revision line, the map path, its lens name, the absolute path of `LENSES.md` and the findings path `<folder>/findings/<lens>.md`, and nothing else. Lenses never see each other's findings.

Check that each findings file exists and that every finding has its Location, Related, Scenario, Evidence, Fix and Severity lines; call a lens again if its file is missing.

## 7. Verify

Grep the findings files for each finding's heading and `- Location:` line; do not read them whole. Group the findings by the path of their first Location, then fill batches of up to six: take the groups from largest to smallest and put each into the first batch with room for it, cutting a group of more than six into sixes. Call one `milepost:audit-refute` agent per batch, all in one message. Give each the target folder, the excluded paths, the revision line, its findings as findings file paths with the IDs to check in each, and the verdicts path `<folder>/verdicts/V<k>.md`, and nothing else: no finding text, no map, no comment.

Check with Grep that every finding has exactly one verdict with Verdict, Checked and Reason lines; call the agent again for any finding that is missing, on its own. Then write `<folder>/rejected.md`: each refuted finding's text followed by its three verdict lines, copied as written.

## 8. Triage

Call the `milepost:audit-triage` agent with the revision line, the map path, `<folder>/findings/`, `<folder>/verdicts/` and the path `<folder>/triage.md`, and nothing else. Check that every finding not refuted appears once, as an entry or under an entry's Merged line, that each entry has its Merged, Severity, Verdict and Why lines, and that each fix group has Findings, Change and Why here.

## 9. Report

Read `REPORTS.md` in the milepost skill's folder (`../milepost/` beside this file) and write the audit report it describes, starting from a copy of its `template/report.html`: `milepost/html/<slug>/A<n>-audit.html`, rendered to `milepost/pdf/<slug>/A<n>-audit.pdf`, with `<slug>` as in step 1. Take each finding's scenario, evidence and fix from its findings file, its check from its verdict, and severities, merges and the fix order from `triage.md`. Translate and shorten into the developer's language, but never change a severity, a verdict, a merge or the order, and add no judgement of your own. Check the pages as REPORTS.md says, and delete any page images or other scratch files you made.

## 10. Reply

Reply with the PDF path and at most three lines: entries per severity, refuted count, and the first fix groups. If `milepost/state.json` exists, add one line to its `log` and change nothing else: `<date> A<n> audit at <revision>: <entries> findings (<high> high, <medium> medium), <refuted> refuted, report milepost/pdf/<slug>/A<n>-audit.pdf; map changes not yet proposed`.
