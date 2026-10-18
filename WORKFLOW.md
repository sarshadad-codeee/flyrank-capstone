# FE-03 Workflow Drill: Vague vs Precise Prompting

Feature: customer feedback form for the facilitation center (CFCLH).

## Method
Round 1 (`round1-vague-prompt`): one sentence, "Add a customer feedback form." Round 2 (`round2-precise-prompt`): a full spec with `@` file references, a field list, accessibility and ASCII-only constraints, and "write tests, run them, fix failures." Both branched from the same master commit. Caveat: `.cursor/rules/project.mdc` was in the repo for both, so Round 1 was accidentally decent. One sentence produced a 23-file full-stack scaffold.

## Correctness
Round 1's phone check `/^[0-9+\-\s]{10,15}$/` counts characters, not digits. In Node, `----------` passes, and the browser accepted `00000000000`. Round 2 strips to digits, requires 10-13, rejects repeated digits (`validateFeedback.ts`), and repeats the check on the server (`feedbackHandler.mjs`, lines 24 and 41). The browser rejected `00000000000` with "looks implausible." Remaining gap: by reading the regex, `1234567890` still passes.

## Accessibility
Round 1 was already solid: labels, `aria-pressed` buttons in a fieldset/legend, and I confirmed Tab navigation by hand. So Round 2 is not clearly better here. Matching aria/label lines: 16 across 4 files (Round 1) vs 24 in one file (Round 2). Round 2's tests find inputs with `getByLabelText` and the rating with `getByRole("button")`, so label association is now enforced by tests. Gap: Round 2's rating buttons show only numerals, where Round 1 showed "Very poor" to "Excellent"; my prompt never asked for labels. I did not repeat the manual Tab test on Round 2.

## Edge cases and tests
Round 1 had zero tests. Round 2 has 10 passing (5 unit, 5 component) covering empty submit, bad format, repeated digits, valid submit, and blank optional fields. Its `.eml` output contains all seven fields.

## Review effort
Round 1 took 25+ minutes, mostly reviewing, and ended with gaps still open. Round 2 took 30+ minutes including generation, test runs and edits. It was not faster end to end here. The difference is that Round 2 finished with verified behavior and Round 1 did not.

## Mistakes caught
1. Round 1's regex accepts hyphen-only input (verified in Node, returns true).
2. Round 2 wrote "Round 2 - ..." into the README Status line, leaking the drill into project docs. I rewrote it.
3. Round 2 added `@ts-expect-error` in `vite.config.ts` to silence a missing type declaration instead of adding one.
