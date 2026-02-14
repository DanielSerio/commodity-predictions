# Gemini Configuration & Notes

This file contains project-specific instructions and persistent context for Gemini (Antigravity).

## Active Instructions

- **TypeScript Debugging**: Whenever you need to write TypeScript output (e.g., from `tsc` or analysis) to a file for review/record, ALWAYS use `typescript-debug.log` in the root directory. This file is ignored by git.
- **Browser Debugging**: For browser-specific analysis output, use `browser-debug.log`.
- **Server Debugging**: For server-side logs/analysis output, use `server-debug.log`.

## Development Principles

- Follow **SOLID**, **YAGNI**, and **DRY** principles.
- Use **TypeScript** (no `any`, prefer literal unions, prefer inference).
- Use **React** functional components and composition.
- Use **CSS Modules** for styling.
- Use **Server Action** or standard API routes for data mutations.
- Use **react-hook-form + zod** for all form implementations.
- All table filtering/sorting occurs on the **server-side**.
