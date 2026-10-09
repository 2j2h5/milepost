---
name: milepost
description: Plans a project-scale goal as a milestone map and writes PDF review documents (a proposal, then a design and a result for each milestone), stopping after each for the developer's review. Use when the developer asks to start work that needs several milestones (a tool, a feature set, a migration), or to continue, review or change an existing milestone plan in docs/reports/state.json. Not for small one-off tasks.
---

# Milestone map

**The developer steers; the milestones are a map, not a script.** The map gives direction between conversations, and documents give the developer a review point at the start and end of each milestone. The documents replace code review, so they must let someone who never opens the diff understand what is planned or was done, why, and how well it worked. Between review points you work as usual with the developer, who can step in at any time.

If a request might be a small one-off task rather than a project-scale goal, ask once before starting a map.

## First: where are we?

Look for `docs/reports/state.json` in the project.

- **It exists:** read it (with `log`), the proposal's summary and milestone plan, and the latest design and result documents (their HTML) before acting. Then continue from `current` and `stage`.
- **It does not exist:** start a new goal with the proposal below.

## Review points

1. **Proposal** (`00-proposal`), once per goal. First research: read the relevant code and search the web for prior art, standard approaches, libraries and known pitfalls, keeping every source for citation. Then propose the goal, the findings and the initial milestone map.
2. **Design** (`M<n>-design`), at the start of each milestone: how this milestone will be built and checked, given the map as it stands now and what earlier milestones taught.
3. **Result** (`M<n>-result`), at the end of each milestone: what was done and achieved against the design's completion criteria, and what that means for the rest of the map.

After each document, reply with its PDF path and a summary of three lines at most, set `awaitingApproval: true`, and wait for the developer's review before going past that point.

## Reading the review

The developer's reply is direction, not just a yes or no. It may approve, ask for changes, add an idea, question a choice, or change course. Act on what it actually says:

- **Changes to this document's content** (a different approach, another criterion): rework it, edit the HTML, render again under the same name, and ask for review again.
- **An idea or a change that reaches beyond this milestone**: work out what it does to the map (milestones added, dropped, split, merged, reordered, or the goal itself reworded), say so plainly in your reply, and update the map once the developer agrees. If the change is large, say whether the proposal should be revised.
- **A question**: answer it; change nothing until the developer decides.
- **Approval**: go on to the next step on the map.

The same holds between review points. A remark during building that only touches how you implement is folded in and reported in the result. One that changes what a milestone delivers or what comes after changes the map: stop and agree on it first.

Every result document ends by checking the remaining map against what was learned and proposing changes when they are warranted; the next design starts from the map as agreed then.

## Changing the map

- If the project already numbers its milestones (a spec, a roadmap, earlier reports), use its numbering and follow its documents where they define a milestone; otherwise number them M1, M2, ….
- Done milestones never change; their documents stay as written.
- A new milestone takes the next unused number (M4 after M3, even if it comes before it in order); the order is the order of the `milestones` array. A dropped one stays in the array as `dropped`.
- Each change adds one line to `log` saying what changed and why (the developer's idea, a result, a failure).
- The next document has a short "changes to the map" paragraph in its background section, citing the review or result that caused them.

## One session per milestone

The map, the log and the documents carry everything a milestone needs, so each milestone runs in a fresh conversation and the context stays small. After a milestone's result is reviewed and committed, mark it done, set `current` to the next planned milestone with stage `design` and `awaitingApproval: false`, and end your reply by suggesting the developer run `/clear` (or open a new session) and then ask to continue the milestone plan. Do not start the next design in the same conversation unless the developer asks to.

## Commits

Commits need the developer's say-so, so get it once up front: in the proposal's review message, ask directly how milestone work should be committed, offering what fits the project (its documented conventions or history first; otherwise current branch / a branch and PR per milestone / no commits). Store the answer as `git` and follow it from then on: commit a milestone's work before writing its result so the document can cite the commit, and commit the result document with the state file after the review.

## Documents

Before writing any document, read `REPORTS.md` in this skill's folder and start from a copy of `template/report.html` in the same folder. Write in the language the developer uses with you.

Each goal has its own folder `docs/reports/<goal-slug>/` holding `00-proposal.html`, `M1-design.html`, `M1-result.html`, … and the PDF rendered from each. When every milestone is done or dropped, the goal is done; a new goal starts with a new proposal in a new folder.

## State file: `docs/reports/state.json`

Create it when the goal starts; update it whenever the stage or the map changes. It describes the current goal only (finished goals live in their folders and in git).

```json
{
  "goal": "short goal name",
  "dir": "docs/reports/<goal-slug>",
  "milestones": [{ "id": "M1", "name": "short name", "status": "planned | active | done | dropped" }],
  "current": "M1",
  "stage": "research | proposal | design | build | result | done",
  "awaitingApproval": false,
  "git": "the developer's commit answer, e.g. commit to current branch; null until asked",
  "log": ["2026-10-09 M3 split into M3 and M4 after the M2 result review: the developer wants the export separate"]
}
```

`current` is null before the first milestone starts and after the goal is done.
