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
