# Process audit

Each process agent reads the shared sections and its own target's section. Write items in general terms; never name a project, a library or an incident the rules were tested against.

## The three questions

Ask all three of every decision in your target.

- **Q1 Was there a better option?** Why was it done this way? Name a concrete alternative that was available (a conventional tool or method, a platform feature, a library, a simpler design, a different order of work) and what it would have saved or avoided. Work that turned out unnecessary counts here too.
- **Q2 Did it leave a problem?** What the decision causes later: a defect, a limit, work that must be redone, a risk the documents do not mention. When the decision lives in code, follow it there.
- **Q3 Was it done as said?** Set the design's promises and the result's claims (criteria met, numbers, files changed) against the commits and the code: a claim the commits do not support, a criterion marked met without a check, a gap reported as partly met that no later document carries.

## PR: proposal

Start from: the proposal document, and the goal and milestone list in the state file.

- Goal and scope: whether the problem is shown with evidence, the goal is the right size and the "not doing" list exists.
- Research: whether it covered the conventional ways to do this, the platform's own features and the known pitfalls.
- Milestone plan: order, size and dependencies; a milestone that a known method would make unnecessary.
- Success criteria: whether each can be measured, and whether the results later measured it.

The remaining milestones come from these decisions, so say in Map effect what each finding changes for them.

## MS: milestones

Start from: each milestone's design and result documents, then the commits the result names.

- Design decisions, and the alternatives the design weighed or left out.
- Result claims: criteria, measurements and "met" marks, checked in the commits and the code.
- Problems the result reported as fixed, deferred or left, and whether a later document picks them up.

## MC: map changes

Start from: the state file's log and milestone list, and each design's paragraph on changes to the map.

- Each change (added, dropped, split, merged, reordered): whether its reason holds and whether a better change existed.
- Work deferred to a later milestone: whether a later document still carries it.
- Changes logged without a reason.

## DE: decisions

Q1 only, in two passes by two agents: one lists the decisions without their reasons, the other searches for better options before reading the reasons.

**Listing.** A decision is a choice of how to meet a need. In each document (the proposal, each design and result, the state file's log) check these areas:

- requirements and scope: the goal's size, success criteria, what is left out;
- architecture and design: overall structure, the core mechanism, how the parts talk;
- construction: language, libraries, platform features, parts built by hand;
- testing and quality: how the work is checked and measured, and whether that is automated;
- operations and configuration: build, install, release, what the repository tracks;
- maintenance and security: updates, diagnostics, trust in inputs, permissions;
- management and process: the order and split of milestones, map changes.

Decisions are not only in a design's main mechanism: they also sit in its plan for checking and measuring, in its order of work and the tools it makes or uses, and in a result's proposed changes for the remaining milestones. Go through every document, results included, and list up to three decisions from each (six from the proposal), larger first. Then, for each area no listed decision covers, add one entry with `Chosen: not stated`. Constraints are only what the goal requires (platform, language, versions, stated requirements), never a limit given as the reason for a choice.

```markdown
### D-<n> <short name>
- Source: <document file and section, or log date>, decided <date>
- Area: <one of the areas above>
- Need: <what had to be achieved>
- Constraints: <what the goal requires, or none>
- Chosen: <what was chosen, or not stated>
```

**Searching.** For each decision, in this order:

1. From its Need, Constraints and Area alone, find how this need is commonly met on the same platform: official documentation, widely used projects, standards. Note up to three common ways with their URLs.
2. If Chosen is one of them, or none fits the Constraints, record that and stop.
3. Otherwise read the Source section and the later documents and log lines about it. If they weighed the common way and set it aside, check that reason against its source. Write a finding only when there is no reason, the source contradicts it, or it does not apply to this project. Kind is better option, or unnecessary when the common way makes the step itself needless.

## Evidence

A finding needs at least one of:

- a source for the alternative (official documentation, a widely used project, a standard) with its URL;
- a quote from a project document with its file and section, set against a commit or `path:line` that contradicts or bears it out;
- a concrete trigger: the input or situation, and the `path:line` steps to what goes wrong.

Opinion without one of these is not a finding.

## Knowable then

For each finding give the decision's date (from the log or the document) and the evidence's date (publication, release or commit), and say whether the evidence existed when the decision was made. A better option that only exists now is still reported, marked `no`.
