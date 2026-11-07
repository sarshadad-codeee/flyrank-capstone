# FE-05 notes: hand-built components versus shadcn/ui

I built a disclosure, tabs and a modal by hand under `src/playground/`,
then added shadcn's dialog and tabs (style `base-nova`) and read the
generated source in `src/components/ui/`. Each point below says how I
know it: read in code, measured in a Vitest test, or seen in the browser
with the keyboard only.

## What shadcn handled that I missed

1. **Dialog description (read in code, measured in a test).** shadcn
   ships a `DialogDescription`, and the dialog gets `aria-describedby`
   automatically. My modal has only `aria-labelledby`. A screen reader
   user hears the title but no description. The shadcn test confirmed
   both the accessible name and the accessible description.

2. **Focus guards (read in the failing test output, seen in the
   browser).** My focus trap listens for Tab on the dialog and wraps
   focus by hand. shadcn's dialog sits on Base UI, which adds hidden
   focus-guard elements outside the dialog and moves focus back in when
   it reaches them. My first jsdom test of shadcn failed because focus
   briefly landed on a guard; it passed once the test waited for the
   redirect. In the browser, focus never left the dialog. The gap in
   mine: a trap built on a keydown handler only sees Tab presses inside
   the dialog. It does not cover focus that escapes some other way
   (a screen reader virtual cursor, for example). I have not tested that
   case, so this part is an inference from how the guards work.

3. **Built-in Close button with a text label (read in code).** shadcn's
   `DialogContent` includes a close button whose label is visually
   hidden (`sr-only`). Mine has a visible Close button that I wrote by
   hand, so it has no close icon variant and no option to turn it off.

4. **Disabled tabs and vertical orientation (read in code).** shadcn's
   tabs accept an orientation and style disabled tabs through data
   attributes. Mine is horizontal only and has no disabled state. I did
   not test a disabled or vertical tab, so this is from the source.

5. **Reusable styling hooks (read in code).** shadcn adds `data-slot`
   attributes and `data-open` / `data-active` state attributes, and
   uses a shared `cn` helper. My components use fixed class strings.
   That is not an accessibility gap, but it is a maintenance gap.

## Where my version differs by design, not by mistake

- **Tab activation (measured in a test, seen in the browser).** My tabs
  use automatic activation: an arrow key moves focus and selects. The
  shadcn tabs use manual activation: arrows move focus only, and Enter
  or Space selects. Both are valid patterns in the ARIA Authoring
  Practices Guide, so neither is a bug. Manual activation suits panels
  that are slow to load; automatic suits instant ones.
- **Both wrap** from the last tab to the first with the arrow keys, and
  both support Home and End (I tested End on both).

## What I could not check

- I did not read Base UI's own source, only the shadcn wrapper files, so
  claims about what Base UI does internally come from test and browser
  behaviour, not from its code.
- I tested with the keyboard only. I did not test with a screen reader.
- jsdom does not apply real browser focus rules, so the focus results
  that matter come from the browser check, not from the tests.

## What I would do differently next time

Reach for the shadcn primitives first and read their source before
writing my own. Writing the three components by hand made the keyboard
rules concrete, which was the point of the exercise.
