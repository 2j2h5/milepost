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
- **Folder:** `milepost/notes/<slug>/A<n>-audit/`, where `<slug>` is the current goal's slug in `milepost/state.json`, or `audit` when there is none, and `A<n>` is the next unused number in that folder.
- **Revision:** `git rev-parse --short HEAD`, plus `dirty` if `git status --porcelain` shows changes outside `milepost/`.

## 2. Scope

Start from the tracked text files (`git grep -I -l ''`) and leave out:

- `milepost/`: the development session's own documents and earlier audits. Reading them would hand the agents the session's view.
- dependency and build output folders (`node_modules`, `vendor`, `third_party`, `dist`, `build`, `bin`, `obj` and the like);
- anything else the developer names; add back what they name.

Count the files, lines and kilobytes left.

## 3. Confirm

Tell the developer the target, revision, scope (files, lines, KB), what was left out and a rough cost estimate, said to be rough. Ask once whether to go ahead or change the scope. Skip the question when the request already accepts the scope and cost.

## 4. Map

Call the `milepost:audit-recon` agent with the target folder, the excluded paths, the revision line and the map path `<folder>/map.md`, and nothing else.

## 5. Report

Check that `map.md` has its seven sections and that promises and claims carry sources. Reply with the map's path, the revision, and the number of trust boundaries (T), promises (P) and claims (C).
