# milepost — Milestone Maps & PDF Review Reports for Claude Code

> A [Claude Code](https://code.claude.com) plugin that turns a big request into a **milestone map** and lets you review every milestone through a **PDF report** (proposal → design → result) instead of thousands of lines of diff. You steer; the map changes with you.

Ever approved an AI-written pull request you never fully read? Or lost track of where a multi-day Claude Code project was heading? milepost makes Claude plan the work as milestones, stop at the start and end of each one, and hand you a short, illustrated document that explains what it will do or did, why, and how well it worked. See [five PDFs from a real run](examples/unit-converter-cli).

## Why milepost

| | |
|---|---|
| **Review documents, not diffs** | Each milestone opens with a design and closes with a result, written for someone who never opens the code: mechanism first, then numbers, with diagrams and tables. |
| **A map that changes** | Your reply to a review is direction, not a yes or no. Add an idea, drop a feature, question a choice: milestones are added, dropped, split or reordered, and every change is logged with its reason. |
| **Evidence over claims** | Results report measured numbers against the design's completion criteria, cite their sources, and include the attempts that failed. |
| **Not automation** | Claude stops at every review point and waits. Between them you work together as usual. |
| **Small context** | The map and documents live in files, so each milestone runs in a fresh session. |

## What the documents look like

Every document shares one design: serif body, ruled tables, numbered figures and tables, inline SVG diagrams, cited sources, and a title that says where in the project you are.

| Document | When | Contents |
|---|---|---|
| **Proposal** | once per goal | summary · background and problem · prior research · goal and scope · milestone plan · risks |
| **Milestone design** | start of each milestone | summary · background and goal · design · implementation plan · evaluation · risks |
| **Milestone result** | end of each milestone | summary · completion criteria · work done (one box per attempt: reason, method, result) · results · discussion · next steps with the remaining map re-checked |

## Usage examples

Start a goal that needs several milestones:

```
Let's build a Python CLI that converts length, weight and temperature units. Keep it to two milestones.
I want a script that finds broken relative links in the repo's Markdown files.
Plan the migration of our REST API from Express to Fastify.
```

Then steer at each review point:

```
Approved.
Drop the anchor check; suggest similar file names for broken links instead.
Why difflib and not Levenshtein distance?
Split M3: ship the export separately.
```

Small one-off tasks are left alone.

## How it works

```
"Let's build X"
   └─ research ─► Proposal PDF ─► review ─┐   goal, findings, initial map
                                          ▼
   ┌─────────── for each milestone on the current map ───────────┐
   │ Design PDF ─► review ─► build ─► commit ─► Result PDF ─► review │
   └──────────────────────────────────────────────────────────────┘
   each review may approve, revise the document, or change the map
```

- The map lives in `docs/reports/state.json`: milestones, current stage, your commit preference, and a log of every change.
- A hooks module adds the working rules and the current state to Claude's system prompt on every request, and shows progress in the status line (`Link checker › M1 file links · design under review`).
- Claude writes each document as HTML from a shared template, renders it to PDF with a headless browser, and checks every page before asking for review.

## Installation

```
/plugin install milepost --marketplace 2j2h5/milepost
```

Answer `y` to add the marketplace, then choose a scope.

**Requirements:** a Chromium browser for PDF rendering (Edge, Chrome or Chromium; Edge ships with Windows). For Korean documents, Noto Serif KR gives the intended look; other serif fonts are used when it is missing.

## Example output

[`examples/unit-converter-cli`](examples/unit-converter-cli) holds a complete two-milestone goal: the proposal, the design and result of each milestone, and the final `state.json`. This run was in Korean; documents follow the language you write in.

## Configuration

| Option | Default | Meaning |
|---|---|---|
| `reportsDir` | `docs/reports` | Where documents and `state.json` go, relative to the project root |

## FAQ

**Is this an autonomous agent?** No. Claude stops after every document and treats your reply as direction.

**Does it commit for me?** Only the way you say. At the proposal review Claude asks how milestone work should be committed (current branch, a branch and PR per milestone, or not at all) and follows that answer.

**Which languages?** Documents are written in the language you use with Claude.

**What does it cost?** In one test run, the whole two-milestone example above (research, five PDFs, code and tests) came to about US$4.75 at Claude Opus API list prices. Your numbers will vary with the project and model.

## Development

```
claude plugin validate .
claude plugin test .
claude --plugin-dir .
```

## Contributing

Issues and pull requests are welcome. Ideas:

- more document kinds (a short status note between review points)
- a Markdown output option for review on GitHub
- report templates for other writing traditions

## License

MIT
