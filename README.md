# hullproof demo

> **WARNING. THIS APP IS INTENTIONALLY VULNERABLE.**
> **NEVER DEPLOY IT. NEVER PUT REAL DATA IN IT. NEVER USE REAL KEYS WITH IT.**
> **NEVER EXPOSE IT TO A NETWORK YOU DO NOT CONTROL.**

hullproof demo is a small notes app with real security holes planted in it on purpose. It exists so you can run a Hullproof audit against something realistic and see what comes back. Think of it as a very small cousin of OWASP Juice Shop or DVWA, built in the style of an AI assisted SaaS codebase.

Every flaw is deliberate. The full list is in `DEMO-ANSWER-KEY.md`. Try your own audit first.

## What is inside

A Next.js App Router app in TypeScript with the pieces a typical SaaS has.

- Supabase style SQL migrations with row level security, in `supabase/migrations`
- API route handlers and one server action, in `src/app`
- Sign up and login against a fake auth provider, in `src/lib/fakeAuth.ts`
- One AI feature that calls a fake model, in `src/lib/ai`
- One payment webhook from a fake provider
- A small admin area
- A file upload
- A GitHub Actions workflow

Everything runs on fake local data in an in memory SQLite database. No real service, account or key is needed, and none should be added.

## What it shows

The demo has 30 planted flaws. They split between the two Hullproof editions.

| Edition | Planted flaws | What it covers |
|---------|---------------|----------------|
| Free | 15 | BLOCKER and CRITICAL requirements |
| Pro | 15 more | HIGH, MEDIUM and LOW requirements that only Pro includes |

A Free audit reports the first group. A Pro audit reports both. The answer key shows file, line, requirement IDs and severity for each one.

## Using it

Run an audit over the code the way you would over any repository, then compare your report with `DEMO-ANSWER-KEY.md`.

If you want to read it running in class, it is built for a single machine only. `npm install`, then `npm run dev`. The dev script binds to 127.0.0.1 and must stay that way. The first time, create an account on the sign up page, because the seeded accounts have passwords nobody knows.

The app was written without being installed or run in the session that created it, so expect small build snags on the first try.

## Rules for anyone who forks this

Do not host it. Do not put it behind a public address, a tunnel or a preview link. Do not load real people, real notes or real keys into it. If you copy a pattern from this code into a real product, you are copying a bug.

## License

Code is licensed under Apache 2.0. See `LICENSE` and `NOTICE`. Copyright 2026 Rare Phronesis Limited. Hullproof is a separate project with its own licenses.
