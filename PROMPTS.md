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


## 13. Write NOTES.md comparing the hand-built components with shadcn (Claude, not Cursor)
Prompt:
Write NOTES.md for FE-05: name at least two concrete gaps between the hand-built modal and tabs and the shadcn versions, label each as read in code, measured in a test or seen in the browser, and list what could not be checked.

## 14. Update the README audit note and add the adoption cost to NOTES.md (Claude, not Cursor)
Prompt:
Read the npm audit output, work out which findings come from the lint tooling and which from shadcn, rewrite the README audit note with the new count without any round, week or assignment labels, and add a measured cost-of-adoption section to NOTES.md.

## 15. Plan the streaming chat assignment on the capstone (Claude, not Cursor)
Prompt:
Plan the streaming AI chat interface on top of the capstone: a route handler using the AI SDK streamText with Claude, a useChat client with a thinking indicator, stop button, scroll-aware auto-scroll and mobile input, and one config module for the system prompt and model. Cut a branch from master and give the first command.

## 16. Add the chat config module and request validator with tests (Claude, not Cursor)
Prompt:
Install the AI SDK packages, then write one chat config module for the system prompt, model and limits, plus a validateChatRequest function that keeps only text parts, drops empty messages and enforces length and count limits, each with Vitest tests. Inspect the real v7 type signatures before writing the route.

## 17. Add the streaming chat route handler with tests (Claude, not Cursor)
Prompt:
Write the /api/chat route handler using the AI SDK streamText with the Anthropic provider, reading the system prompt and model from the config module, validating the body before any model call, passing the request abort signal, returning a generic stream error, and never exposing the API key. Add Vitest tests that mock the model and check each early-return case.

## 18. Build the streaming chat UI with thinking indicator and stop button (Claude, not Cursor)
Prompt:
Build the /chat page and Chat component with the AI SDK useChat and DefaultChatTransport: render only text parts through a small helper, show a thinking indicator that hands off to the streamed text in the same position, a Send button that becomes Stop while generating, partial text kept after a stop, a fixed error message and a mobile-friendly input. Add Vitest tests with useChat mocked, and tests for the helper functions.

## 19. Switch the chat provider to the free Gemini API (Claude, not Cursor)
Prompt:
The programme's free-tier guide says FE-06 should use the free Gemini API through the AI SDK, with no paid API. Install the AI SDK Google provider and read its real key variable name and model IDs before changing the route, config and tests.

## 20. Swap the chat route to Gemini and add a per-visitor rate limit (Claude, not Cursor)
Prompt:
Switch the chat route and config from the Anthropic provider to the AI SDK Google provider with the free-tier Gemini Flash-Lite model and the GOOGLE_GENERATIVE_AI_API_KEY variable. Add an in-memory per-visitor rate limiter returning 429 with Retry-After, with Vitest tests for the limiter and the route, and update .env.example with the variable name only.

## 21. Add scroll-aware auto-scroll, jump to latest and a phone-width pass (Claude, not Cursor)
Prompt:
Add auto-scroll to the chat that pins to the bottom only while the user is at the bottom, releases when they scroll up, re-pins on send, and offers a Jump to latest button. Put the near-bottom check in a tested helper, make the log keyboard focusable, and make the send and stop buttons and the chat height work at phone width. Test the scroll behaviour with mocked scroll metrics.
