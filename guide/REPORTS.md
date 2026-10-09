# Writing the documents

Three kinds, one design. The reader is a developer who will approve the work without reading the code, so each document must explain the mechanism, show it in figures and tables, and back every claim with a number or a source.

Headings below are given in English with Korean in brackets. Write them in the developer's language, worded the same way in every document of the goal.

## Front page (all three)

- **Title**: says where in the loop this is. Proposal: `<goal> Proposal` [`<목표> 프로포절`]. Milestone documents: `<id> <milestone name> Design` / `Result` [`M2 데이터 모델 설계` / `M2 데이터 모델 결과`].
- **Date** under the title, in the developer's locale (`2026. 10. 09.`). Nothing else: no subtitle, authors, version or organisation.
- **Contents**: section links only (no page numbers).
- **Purpose box**: one paragraph starting with a bold `Purpose.` [`문서의 목적.`]: what this document is for and what decision it asks of the reader. Nothing else goes in the box.

## Contents of each kind

Section 1 is always Summary; the list ends with References. Keep these six sections; use subsections (2.1, 2.2) for anything more.

| | Proposal | Milestone design | Milestone result |
|---|---|---|---|
| 1 | Summary [요약] | Summary [요약] | Summary [요약] |
| 2 | Background and problem [배경과 문제] | Background and goal [배경과 목표] | Goal and completion criteria [목표와 완료 기준] |
| 3 | Prior research [사전 조사] | Design [설계] | Work done [수행 내용] |
| 4 | Goal and scope [목표와 범위] | Implementation plan [구현 계획] | Results [결과] |
| 5 | Milestone plan [마일스톤 계획] | Evaluation [평가 방법] | Discussion [논의] |
| 6 | Risks [위험과 대응] | Risks [위험과 대응] | Next steps [다음 단계] |
| | References [참고 출처] | References [참고 출처] | References [참고 출처] |

What goes where:

- **Summary**: the whole document in under half a page: the problem, what is proposed or was done, and the key numbers. Two to four bold lead phrases in bullets work well. A reader who stops here should still be able to decide.
- **Proposal**
  - *Background and problem*: the situation now, with evidence, and why it matters.
  - *Prior research*: what others do (approaches, libraries, papers) and what this project can reuse or must avoid. A comparison table of options is usually right.
  - *Goal and scope*: one-sentence goal, measurable success criteria, and an explicit "not doing" list.
  - *Milestone plan*: the initial map, expected to change as the work teaches things: a dependency figure of the milestones plus a table (milestone · content · completion criterion).
  - *Risks*: table (risk · likelihood or impact · response).
- **Design**
  - *Background and goal*: where the previous milestone left things and what this one must achieve. If the map changed since the last document, a short "changes to the map" paragraph (what, why, which review or result caused it), with the dependency figure redrawn when the order changed.
  - *Design*: the mechanism. Show before/after of the flow as a figure; explain each new part in its own subsection.
  - *Implementation plan*: table of files/modules (file · change · reason) and the order of work. New dependencies are flagged for approval.
  - *Evaluation*: tests and measurements, data used, and the completion criteria as a table.
  - *Risks*: what could go wrong and how it will be noticed.
- **Result**
  - *Goal and completion criteria*: restate the design's criteria with met / partly met / not met for each.
  - *Work done*: one boxed block per attempt (see "Attempt box"), grouped by where in the system it sits; failures and abandoned attempts included.
  - *Results*: the combined outcome against the baseline, as charts and tables; anything the developer judged by eye is reported as such.
  - *Discussion*: what was learned (bold lead sentence + explanation) and the limits of the evidence.
  - *Next steps*: the remaining map checked against what was learned: a table of the remaining milestones (milestone · as planned · proposed change and why), "no change" where none is warranted, followed by open decisions for the developer.

## Writing

- Plain declarative sentences. Present tense for plans, past tense for what was done. In Korean, end sentences with `-다`.
- Explain the mechanism before the numbers. Define each term at its first use. Prefer a concrete example over an abstract claim.
- Every number has a unit and a source; mark interpretations that were not verified as such ("(not verified)" [`(검증 안 함)`]).
- Bold only the one phrase per paragraph that carries the claim.
- Cite with brackets: `[R1]` external sources (papers, docs, libraries), `[D1]` the project's own material (files, PRs, commits, earlier documents of this loop). The reference list gives full entries, R first, then D.
- As short as it can be while complete. Typical length: proposal 5–10 pages, design 4–8, result 6–14.

## Figures and tables

Every section from 2 on should have at least one figure or table; a page of text alone is a sign something should be drawn.

- **Table**: caption *above*: `Table N. Bold title. Optional note. [cite]` [`표 N.`]. Heavy rule above and below, light rules between rows, first column bold when it holds row labels (add `class="data"` to the table when the first column is data, such as formulas or values). Numbers right-aligned or consistently formatted.
- **Numbered steps**: an `<ol>` or bold-led paragraphs; never ①②③ inside a bulleted list (two markers per line).
- **Figure**: caption *below*: `Figure N. Bold title. One or two sentences saying what to look at.` [`그림 N.`]. Number figures and tables separately, in order, and refer to each in the text.
- **Drawing style** (inline SVG, grayscale only, copy the patterns in the template):
  - boxes: white or light gray fill, thin dark stroke; **thick stroke** marks what is new or central; **dashed** marks optional, not done yet, or cross-cutting.
  - arrows for flow; labels inside boxes in two lines (bold name, small detail).
  - before/after flows as two rows labelled (a) and (b).
  - bar charts: compute every coordinate from the data (value ÷ axis max × axis length) and print the value on each bar; same axis max for bars that are compared.
- Good figure types: before/after pipeline, concept sketch of the core idea, milestone dependency graph, result bars against baseline, a schematic drawn to scale when shape matters.

## Attempt box (result documents)

One `div.attempt` per attempt:

- heading: `① Name (id) — status`, status from one fixed vocabulary used throughout the goal (for example adopted / option / rejected / deferred [채택 / 옵션 / 채택 안 함 / 보류]);
- then three bold-led paragraphs: **Reason.** why it was tried [이유], **Method.** what was done [방식], **Result.** measured outcome and the decision [결과].

## Rendering and checking

Write the HTML next to where the PDF goes, then render with a Chromium browser (Edge or Chrome) in headless mode:

```
<browser> --headless --disable-gpu --no-pdf-header-footer --print-to-pdf="<abs path>.pdf" "file:///<abs path>.html"
```

Windows Edge: `C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`. macOS Chrome: `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`. Linux: `chromium` or `google-chrome`.

Then open the PDF with your file-reading tool and check every page:

- figures inside the margins; no overlapping or clipped text in SVGs;
- tables not cut in odd places; no near-empty page caused by a figure or table pushed to the next one;
- every figure and table numbered in order and referred to in the text;
- contents entries matching the headings.

Fix and render again before asking for review; look again only at the pages the fix moved.
