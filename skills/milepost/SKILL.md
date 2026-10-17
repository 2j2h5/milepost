---
name: milepost
description: Plans a project-scale goal as a milestone map and writes PDF review documents (a proposal, then a design and a result for each milestone), stopping after each for the developer's review. Use when the developer asks to start work that needs several milestones (a tool, a feature set, a migration), or to continue, review or change an existing milestone plan in milepost/state.json. Not for small one-off tasks.
---

# Milestone map

**The developer steers; the milestones are a map, not a script.** The map gives direction between conversations, and documents give the developer a review point at the start and end of each milestone. The documents replace code review, so they must let someone who never opens the diff understand what is planned or was done, why, and how well it worked. Between review points you work as usual with the developer, who can step in at any time.

If a request might be a small one-off task rather than a project-scale goal, ask once before starting a map.

## First: where are we?

Look for `milepost/state.json` at the project root.

- **It exists:** read it (with `log`), the current goal's proposal summary and milestone plan, and its latest design and result documents (their HTML) before acting. Then continue from `current` and `stage`.
- **Only `docs/reports/state.json` exists** (an older milepost layout): tell the developer, then move everything into the layout under Documents (each goal folder's HTML, PDFs, images and notes to their own folders; `state.json` to `milepost/state.json`, with `dir` replaced by `slug`), fix the image paths in the HTML, and remove the emptied old folders. If the old folder was ignored by git, record `"folder": "ignore"` and, after asking, replace its `.gitignore` entry with `milepost/` so the new folder stays ignored. Then continue as above.
- **Neither exists:** start a new goal with the proposal below.

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

Commits need the developer's say-so, so get it once up front: in the proposal's review message, ask two direct questions.

1. **The work:** how milestone work should be committed, offering what fits the project (its documented conventions or history first; otherwise current branch / a branch and PR per milestone / no commits).
2. **The `milepost/` folder:** commit it with the work, so teammates can review the documents too, or keep it out of git through `.gitignore`. Say the trade-off in one line: kept out, the documents and the map in `state.json` exist only on this machine, and another clone starts without them.

Store both answers in `git` and follow them from then on without asking again:

- Commit a milestone's work before writing its result, so the document can cite the commit.
- **Folder committed:** after each review, commit the document with `state.json` the same way as the work.
- **Folder kept out:** add `milepost/` to `.gitignore` right away, to be committed with the next commit of the work if there is one (if the folder is already tracked, also run `git rm -r --cached milepost`), and never commit anything under it.

## Documents

Before writing any document, read `REPORTS.md` in this skill's folder and start from a copy of `template/report.html` in the same folder. Write in the language the developer uses with you.

Everything milepost keeps lives in one folder at the project root, sorted by kind and then by goal:

```
milepost/
  state.json                    the current goal and the history of earlier ones
  pdf/<goal-slug>/              00-proposal.pdf, M1-design.pdf, M1-result.pdf, …
  html/<goal-slug>/             the HTML each PDF is rendered from, same names
  images/<goal-slug>/<id>/      image files a document uses, one folder per milestone (00 for the proposal)
  notes/<goal-slug>/            research notes and sources gathered for the documents
```

- Nothing else goes in `milepost/`. Scratch work (text extracted to check a PDF, test renders, temporary scripts) goes in a temporary folder outside the project and is deleted when done.
- HTML refers to its images by relative path, such as `../../images/<goal-slug>/M3/fig-1.png`, so the PDF renders with them.
- Revisions overwrite the same file name; do not keep `-v1`, `-v2` copies unless the developer asks.

## Goals

A goal ends, and the next one starts with a new proposal under a new `<goal-slug>` in each folder, when either:

- **every milestone on the map is done or dropped**, or
- **the developer changes the topic itself** rather than the milestones toward it. Say that you read the change this way and confirm before acting. Then close the current goal: mark its remaining milestones `dropped`, log why, and move it into `history`.

## State file: `milepost/state.json`

Create it when the first goal starts; update it whenever the stage or the map changes. The top level describes the current goal; `history` keeps one line per earlier goal.

```json
{
  "goal": "short goal name",
  "slug": "goal-slug",
  "milestones": [{ "id": "M1", "name": "short name", "status": "planned | active | done | dropped" }],
  "current": "M1",
  "stage": "research | proposal | design | build | result | done",
  "awaitingApproval": false,
  "git": { "work": "the developer's answer, e.g. a branch and PR per milestone", "folder": "commit | ignore" },
  "log": ["2026-10-09 M3 split into M3 and M4 after the M2 result review: the developer wants the export separate"],
  "history": [{ "goal": "earlier goal", "slug": "earlier-slug", "ended": "2026-10-01", "how": "done | topic changed", "note": "one line" }]
}
```

`current` is null before the first milestone starts and after the goal is done. `history` is empty for the first goal. `git` is null until the developer answers at the first proposal review.
