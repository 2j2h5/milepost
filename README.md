# milepost

A Claude Code plugin that gives Claude a **milestone map** for a goal and puts **PDF review points** at the start and end of every milestone. You steer by reviewing documents instead of diffs; the map changes with what you say and what the work teaches.

```
"Let's build X"
   └─ research ─► Proposal PDF ─► review ─┐   (goal, findings, initial map)
                                          ▼
   ┌──────────── for each milestone on the current map ────────────┐
   │  Design PDF ─► review ─► build ─► commit ─► Result PDF ─► review │
   └──────────────────────────────────────────────────────────────┘
   every review may approve, revise the document, or change the map
```

## What you get

- **Three kinds of document**, one design (serif body, ruled tables, numbered figures and tables, inline SVG diagrams, cited sources):
  - **Proposal**: summary, background, prior research, goal and scope, milestone plan, risks.
  - **Milestone design**: summary, background and goal, design, implementation plan, evaluation, risks.
  - **Milestone result**: summary, completion criteria met or not, work done (one box per attempt: reason, method, result, failures included), results, discussion, next steps with the remaining map re-checked.
- **Review points, not automation.** Claude stops after each document and treats your reply as direction: approve, ask for changes, add an idea, ask a question, or change course.
- **A living map** in `docs/reports/state.json`: milestones added, dropped, split or reordered as the work goes, each change logged with its reason.
- **One session per milestone.** The map and documents carry the context, so Claude suggests `/clear` between milestones and picks up where it left off.
- **Status line**: where the goal stands, e.g. `Link checker › M1 file links · design under review`.
- Documents follow the language you write in.

## Install

```
/plugin install milepost --marketplace 2j2h5/milepost
```

Answer `y` to add the marketplace, then choose a scope.

**Needs** a Chromium browser for PDF rendering (Edge, Chrome or Chromium; Edge ships with Windows). For Korean documents, Noto Serif KR gives the intended look; other serif fonts are used when it is missing.

## Use

Ask for something that needs several milestones:

```
I want a Python script that finds broken relative links in the repo's Markdown files.
Standard library only; keep it to about two milestones.
```

Claude researches, writes `docs/reports/<goal>/00-proposal.pdf`, asks how milestone work should be committed, and waits. Reply with whatever you think: "approved", "drop the anchor check and suggest similar file names instead", "why difflib?". Small one-off tasks are left alone.

## Configure

| Option | Default | Meaning |
|---|---|---|
| `reportsDir` | `docs/reports` | Where documents and `state.json` go, relative to the project root |

## How it works

The plugin is a hooks module (`hooks/register.ts`) that adds one section to the system prompt on every request: the working rules (`guide/PROTOCOL.md`) and the current `state.json`. Claude reads `guide/REPORTS.md` and copies `template/report.html` when it writes a document, then renders it with a headless browser and checks every page.

## Develop

```
claude plugin validate .
claude plugin test .
claude --plugin-dir .
```
