# Prompts used (FE-04 skeleton)

## 1. Capstone skeleton (Claude, not Cursor)
Tool note: the Cursor agent limit was reached, so Claude generated the code
and I applied, built and reviewed it by hand.

Prompt:
Scaffold the app: routes, root layout, navigation, and a placeholder page for
every screen (feedback form, thank you, health check). Server Components by
default, Client Components only where interactivity is needed. Set up Tailwind
and base design tokens in globals.css. Add a health-check page that renders
data from a server function, plus an /api/health route returning the same data.
Read the incharge email only from a server-side env variable.
Review notes: the template enables Cache Components, so the health page wraps
its uncached read in Suspense, as the bundled Next.js docs describe.

## 2. Vitest and a health test (Claude, not Cursor)
Prompt:
Add Vitest. Write tests for getHealth: status ok, service name, node version, ISO timestamp, email configured flag, and that the email address itself is never returned. Mock next/server because connection() needs a real request.

## 3. Update project rules for Next.js (Claude, not Cursor)
Prompt:
Update .cursor/rules/project.mdc for the Next.js stack. Keep the FE-03 rules, but make the incharge-address check allow the variable name in server code only, and use ASCII only.

## 4. Rewrite the README for the Next.js app (Claude, not Cursor)
Prompt:
Rewrite the README Stack, Status and Setup sections for the Next.js app. Describe the product only, with no round, week or assignment labels. Add scripts, an environment variables table that lists INCHARGE_EMAIL without a value, and a note about the npm audit findings.

## 5. Rename package and add live URL (Claude, not Cursor)
Prompt:
Rename the package to customer-feedback-module without changing dependency versions, and add the live Vercel URL to the README. This branch also served as the test push for preview deployments.

## 6. Plan FE-05 accessible components on the capstone (Claude, not Cursor)
Prompt:
Plan FE-05 (Accessible component fundamentals) on top of the capstone repo: a modal dialog, tabs and a disclosure built by hand in React + TypeScript under a playground, followed by a shadcn dialog and tabs comparison and NOTES.md. Cut a branch from master and give the first command.

## 7. Build the disclosure component with a keyboard test (Claude, not Cursor)
Prompt:
Add the Vitest and Testing Library tooling, then build the first FE-05 component: a disclosure under src/playground with an explicit props interface, a jsdom keyboard test for Tab, Enter and Space, and a playground route that is not indexed.

## 8. Build the tabs component with a keyboard test (Claude, not Cursor)
Prompt:
Build the second FE-05 component: tabs under src/playground following the ARIA tabs pattern, with roving tabindex, arrow keys with wrap, Home and End, aria-controls and aria-labelledby links, an explicit props interface with no any, a jsdom keyboard test, and a Tabs section on the playground page.

## 9. Build the modal dialog with a focus trap and keyboard test (Claude, not Cursor)
Prompt:
Build the third FE-05 component: a modal dialog under src/playground following the ARIA dialog pattern, rendered in a portal with role dialog, aria-modal and aria-labelledby, moving focus in on open, trapping Tab and Shift+Tab, closing on Escape and backdrop click, returning focus to the opener, and making the rest of the page inert. Use an explicit props interface with no any, add a jsdom keyboard test, and add a Modal section to the playground page.

## 10. Initialise shadcn/ui for the FE-05 comparison (Claude, not Cursor)
Prompt:
Initialise shadcn/ui in the capstone on the FE-05 branch with default answers, so its dialog and tabs can be added next and compared with the hand-built versions. Check the diff, the ASCII-only rule, tsc, lint and tests before committing.

## 11. Fix shadcn init side effects and test its helpers (Claude, not Cursor)
Prompt:
After the shadcn init, restore the Geist font variable that globals.css broke, switch the three text-muted uses to text-muted-foreground and keep the old text grey for contrast, and add Vitest tests for the cn helper and the Button component.

## 12. Add shadcn dialog and tabs demo and tests (Claude, not Cursor)
Prompt:
Add the shadcn dialog and tabs to the playground in a client demo component, and write Vitest keyboard tests for them, so their focus, Escape and arrow-key behaviour is measured before writing NOTES.md.

