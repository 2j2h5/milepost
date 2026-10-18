---
name: milepost-audit
description: Audits a whole repository from an outsider's view. Agents that never saw the development conversation map the code, the promises it makes and its trust boundaries, then review it. Use when the developer asks to audit or review the whole repository, often partway through a milepost plan. Not for one diff or pull request (use code-review) or a deep security scan (use claude-security).
---

# Repository audit

**An outside view of the whole repository.** milepost's review points show what the development session says it did. An audit has agents that never saw that conversation read the code itself, starting from what the project promises and where outside data comes in. It finds and reports; fixes go through the milestone map.

## Stay out of the judging

This skill usually runs in the conversation that built the code, so that conversation is the one view the audit must not inherit. Here you only pick the target, count, ask and call the agents. Never pass an agent a summary of the conversation, your opinion of the code or hints about known problems. Each agent gets exactly what its step lists.

## 1. Target and output

- **Target:** the git top-level folder (`git rev-parse --show-toplevel`).
- **Folder:** `milepost/notes/<slug>/A<n>-audit/`, where `<slug>` is the current goal's slug in `milepost/state.json`, or `audit` when there is none (an older `docs/reports/state.json` does not count), and `A<n>` is the next unused number in that folder.
- **Revision:** `git rev-parse --short HEAD`, plus `dirty` if `git status --porcelain` shows changes outside `milepost/`.

## 2. Scope

Start from the tracked text files (`git grep -I -l ''`) and leave out:

- `milepost/`: the development session's own documents and earlier audits. Reading them would hand the agents the session's view. The same goes for `docs/reports/` when it holds a `state.json` (milepost's older layout).
- dependency and build output folders (`node_modules`, `vendor`, `third_party`, `dist`, `build`, `bin`, `obj` and the like);
- anything else the developer names; add back what they name.

Count the files, lines and kilobytes left.

## 3. Confirm

Tell the developer the target, revision, scope (files, lines, KB), what was left out, the lenses to run (all five in `LENSES.md` beside this file unless the developer names some) and a rough cost estimate, said to be rough. Ask once whether to go ahead or change the scope. Skip the question when the request already accepts the scope and cost.

## 4. Map

Call the `milepost:audit-recon` agent with the target folder, the excluded paths, the revision line and the map path `<folder>/map.md`, and nothing else.

Check that `map.md` has its seven sections and that promises and claims carry sources before going on.

## 5. Lenses

Call one `milepost:audit-lens` agent per lens, all in one message so they run in parallel. Give each the target folder, the excluded paths, the revision line, the map path, its lens name, the absolute path of `LENSES.md` and the findings path `<folder>/findings/<lens>.md`, and nothing else. Lenses never see each other's findings.

## 6. Report

Check that each findings file exists and that every finding has its Location, Related, Scenario, Evidence, Fix and Severity lines; call a lens again if its file is missing. Do not comment on what the findings say: judging them is the next step's job. Reply with the folder, the revision, the map counts (T, P, C) and a table of findings per lens by severity.
