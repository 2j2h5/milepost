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

## Evidence

A finding needs at least one of:

- a source for the alternative (official documentation, a widely used project, a standard) with its URL;
- a quote from a project document with its file and section, set against a commit or `path:line` that contradicts or bears it out;
- a concrete trigger: the input or situation, and the `path:line` steps to what goes wrong.

Opinion without one of these is not a finding.

## Knowable then

For each finding give the decision's date (from the log or the document) and the evidence's date (publication, release or commit), and say whether the evidence existed when the decision was made. A better option that only exists now is still reported, marked `no`.
