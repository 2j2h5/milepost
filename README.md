# milepost — Milestone Maps & PDF Review Reports for Claude Code

> A [Claude Code](https://code.claude.com) plugin that turns a big request into a **milestone map** and lets you review every milestone through a **PDF report** (proposal → design → result) instead of thousands of lines of diff. You steer; the map changes with you.

**From vibe coding to reviewed agentic coding.** Vibe coding accepts AI output nobody reads; reading every diff does not scale either. milepost sits in between: Claude works on its own inside a milestone, and you steer between milestones by reading a short document instead of the code.

Ever approved an AI-written pull request you never fully read? Or lost track of where a multi-day Claude Code project was heading? milepost makes Claude plan the work as milestones, stop at the start and end of each one, and hand you a short, illustrated document that explains what it will do or did, why, and how well it worked. See [five PDFs from a real run](#example-output). When you want a second opinion, `milepost-audit` has agents that never saw the development conversation check the plan's decisions and then the code, and turns what survives their own refutation into map changes. See [Repository audit](#repository-audit).

## Why milepost

| Feature | What it means |
|---|---|
| **Review documents, not diffs** | Each milestone opens with a design and closes with a result, written for someone who never opens the code: mechanism first, then numbers, with diagrams and tables. |
| **A map that changes** | Your reply to a review is direction, not a yes or no. Add an idea, drop a feature, question a choice: milestones are added, dropped, split or reordered, and every change is logged with its reason. |
| **Evidence over claims** | Results report measured numbers against the design's completion criteria, cite their sources, and include the attempts that failed. |
| **Not automation** | Claude stops at every review point and waits. Between them you work together as usual. |
| **Small context** | The map and documents live in files, so each milestone runs in a fresh session. |
| **An outside audit** | On request, fresh agents audit the plan and the whole repository, try to refute every finding, and hand the rest back to the map. |

## What the documents look like

Every document shares one design: serif body, ruled tables, numbered figures and tables, inline SVG diagrams, cited sources, and a title that says where in the project you are.

| Document | When | Contents |
|---|---|---|
| **Proposal** | once per goal | summary · background and problem · prior research · goal and scope · milestone plan · risks |
| **Milestone design** | start of each milestone | summary · background and goal · design · implementation plan · evaluation · risks |
| **Milestone result** | end of each milestone | summary · completion criteria · work done (one box per attempt: reason, method, result) · results · discussion · next steps with the remaining map re-checked |
| **Audit report** | when you ask for an audit | summary · scope and method · findings (plan, then code) · fix order with map effects · what was refuted · limits |

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

In a new session, pick up where you left off:

```
Continue the milestone plan.
/milepost:milepost
```

Ask for an outside audit, usually partway through a plan:

```
Audit this repository.
/milepost:milepost-audit
```

Small one-off tasks are left alone.

## How it works

```
"Let's build X"
   └─ research ─► Proposal PDF ─► review ─┐   goal, findings, initial map
                                          ▼
   ┌───────────── for each milestone on the current map ─────────────┐
   │ Design PDF ─► review ─► build ─► commit ─► Result PDF ─► review │
   └─────────────────────────────────────────────────────────────────┘
   each review may approve, revise the document, or change the map
```

- Everything lives in one `milepost/` folder at the project root: `state.json` (the map: milestones, current stage, your commit preference, a log of every change, and earlier goals), then `pdf/`, `html/`, `images/` and `notes/`, each split by goal. A goal ends when its map is finished or when you change the topic; the next one gets its own folders.
- The planning skill (`skills/milepost/SKILL.md`) loads when you start a project-scale goal or ask to continue one, or when you run `/milepost:milepost`. It reads `state.json` first and continues from there.
- Claude writes each document as HTML from a shared template, renders it to PDF with a headless browser, and checks every page before asking for review.

## Repository audit

The development session only reports what it says it did. `milepost-audit` (a second skill and five agents) gets an outside view: agents that never saw the conversation read the milepost documents as claims to check, then the code, and must back every finding with evidence.

```
recon map + plan audit ─► refute ─► scope ─► 5 code lenses ─► refute ─► triage ─► PDF report
   │  proposal, finished milestones, map changes:                                     │
   │  a better option? a problem left? done as said?          next "continue" ◄───────┘
   └─ without milepost/state.json the plan steps are skipped   proposes map changes per fix group
```

- The code lenses are trust, concurrency, failure, supply and maintain. A refute agent re-traces each finding and runs it in a temporary copy when it can; refuted findings are listed, not dropped silently.
- Before starting it states the scope, the plan targets and a rough cost, and asks once. It writes `A<n>-audit.pdf` and one `log` line. The next "continue" proposes, per fix group, a new milestone, a fold into a planned one, or not now, and waits for you.

| Use | For |
|---|---|
| `code-review` | one diff or pull request |
| `claude-security` | a deep security review |
| `milepost-audit` | the whole repository and the plan behind it, from outside |

**Measured so far.** All numbers come from the author's own project [winsill](https://github.com/2j2h5/winsill); the planted flaws were written by the same side that wrote the rules, and the grader is the same model family. Read them as one project's evidence, not a benchmark.

| | milepost-audit | plain prompt |
|---|---|---|
| Code: issues a human review had found (4 on one commit, 10 on another) | 4, 4, 2 of 4 · 7, 6 of 10 | 1 of 4 · 1 of 10 |
| Refute: planted baseless findings refuted (code, plan) | 3 of 3, 4 of 4 | – |
| Refute: real findings wrongly refuted (code, plan) | 0 of 38, 0 of 3 | – |
| Plan: planted flaws found, on records the rules were never tuned on | 4 of 9 | 3 of 9 (plan review), 0 of 9 (code review) |
| Cost and time, plan + code (about 3,700 lines, 5 documents) | US$15.23, 28 min | US$1.3–1.6 |
| Cost and time, code only | about US$10, 25–50 min | |

Known limits:

- On the plan, the audit is **about the same as a plain prompt** (4 vs 3 of 9 is no real difference at that size). It finds different things: promises dropped between documents and reasons contradicted by official docs, while a plain prompt sometimes catches a mismatch inside one document that a run of the audit misses.
- "Was there a better option?" is weak: a worse choice written without a reason was found 0 of 2 times, and decisions the developer later changed 0 of 4.
- Results vary from run to run, even on the same commit (4, 4 and 2 of 4 above).
- Leaving code out of the audit because a confirmed better option replaces it never triggered in real runs.
- Stronger evidence needs other projects, repeated runs and answers set by people.

## Installation

```
/plugin install milepost --marketplace 2j2h5/milepost
```

Answer `y` to add the marketplace, then choose a scope.

**Requirements:** a Chromium browser for PDF rendering (Edge, Chrome or Chromium; Edge ships with Windows). For Korean documents, Noto Serif KR gives the intended look; other serif fonts are used when it is missing.

## Example output

A complete two-milestone goal (a Python unit conversion CLI), attached to the [v0.1.0 release](https://github.com/2j2h5/milepost/releases/tag/v0.1.0):

- [Proposal](https://github.com/2j2h5/milepost/releases/download/v0.1.0/00-proposal.pdf)
- M1 Conversion core: [design](https://github.com/2j2h5/milepost/releases/download/v0.1.0/M1-design.pdf) · [result](https://github.com/2j2h5/milepost/releases/download/v0.1.0/M1-result.pdf)
- M2 Command-line interface: [design](https://github.com/2j2h5/milepost/releases/download/v0.1.0/M2-design.pdf) · [result](https://github.com/2j2h5/milepost/releases/download/v0.1.0/M2-result.pdf)
- the final [`state.json`](examples/unit-converter-cli/state.json)

Documents follow the language you write in; this run was translated to English for the example.

## What it runs and sends

- **The plugin itself runs no code.** It contains two skills and five agents: instructions in Markdown and an HTML report template. It has no hooks, scripts, MCP servers or executables. Installed, it adds about 850 tokens of descriptions to each session.
- **Planning, following the skill and your usual permissions,** searches the web during research, writes documents and `state.json` under `milepost/`, runs a local headless browser (Edge, Chrome or Chromium) to turn each document into a PDF, and commits only the way you choose at the proposal review.
- **An audit** runs its five agents on Claude Sonnet. They read the repository with git and search commands; when a finding depends on a library, they download the version the repository pins into a temporary folder and only read it. Plan auditors and refuters search the web, so queries can contain names from your documents. Refuters may run a finding in a temporary copy with tools already installed; the rules forbid installing anything, administrator rights, registry or service changes and running anything in your repository. Agents delete their temporary folders, but one may stay if your permission mode blocks the delete. The audit writes only under `milepost/`.
- Nothing is sent anywhere except what Claude Code itself already sends.

## FAQ

**Is this an autonomous agent?** No. Claude stops after every document and treats your reply as direction.

**How is this different from vibe coding?** Vibe coding skips both the plan and the review. milepost keeps the speed of letting Claude work on its own, but adds a plan you agreed to and a review point at the start and end of every milestone, so you always know what was built and why without reading every line.

**Does it commit for me?** Only the way you say. At the proposal review Claude asks two things once: how milestone work should be committed (current branch, a branch and PR per milestone, or not at all), and whether the `milepost/` folder goes into git with it, so teammates can review the documents too, or stays out through `.gitignore`, private to your machine. It follows both answers from then on.

**Which languages?** Documents are written in the language you use with Claude.

**What does it cost?** In one test run, the whole two-milestone example above (research, five PDFs, code and tests) came to about US$4.75 at Claude Opus API list prices. An audit cost about US$10–15 in tests (see [Repository audit](#repository-audit)). Your numbers will vary with the project and model.

**Does the audit replace reading the code?** No. It is one more outside view, measured on one project, and it misses things (see its limits). Use it before a release or when a plan has run long.

## Development

```
claude plugin validate .
claude --plugin-dir .
```

## Contributing

Issues and pull requests are welcome. Ideas:

- more document kinds (a short status note between review points)
- a Markdown output option for review on GitHub
- report templates for other writing traditions

## License

MIT
