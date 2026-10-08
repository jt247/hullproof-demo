# Demo answer key

This file lists every flaw planted on purpose in hullproof demo. It is the answer sheet for an audit. Do not read it before you try an audit yourself.

There are 30 planted flaws. 15 map to requirements in the Free edition (BLOCKER and CRITICAL). 15 map to requirements that the Pro edition adds (HIGH, MEDIUM and LOW). Of those 15, 12 trip no Free requirement, and 3 (P07, P12, P13) are also caught by a Free requirement, so a Free audit can report them too. Severity and edition for each ID were read from `security-controls.json` in the Hullproof Pro kit, not guessed. Line numbers match the code as committed.

## Free edition findings

| # | Flaw | Where | Hullproof IDs (severity, edition) | Caught by |
|---|------|-------|------|------|
| F01 | The notes table never enables row level security and grants read access to the anon role. | `supabase/migrations/0002_notes.sql:2`<br>`supabase/migrations/0002_notes.sql:14` | SEC-DB-001 (BLOCKER, free)<br>SEC-AUTHZ-010 (BLOCKER, free)<br>SEC-DB-003 (CRITICAL, free) | Free |
| F02 | Clients can write their own role and plan. The update grant covers the whole profiles row, and the server action accepts role and plan from the form. | `supabase/migrations/0001_profiles.sql:21`<br>`src/app/actions/profile.ts:11` | SEC-DB-033 (BLOCKER, free)<br>SEC-AUTHZ-004 (CRITICAL, free) | Free |
| F03 | The export route has no authentication and returns every user's notes with their email. | `src/app/api/notes/export/route.ts:5` | SEC-API-001 (BLOCKER, free)<br>SEC-DATA-024 (BLOCKER, free) | Free |
| F04 | Insecure direct object reference. A note is fetched by id with no owner check. | `src/app/api/notes/[id]/route.ts:13` | SEC-AUTHZ-003 (BLOCKER, free) | Free |
| F05 | SQL injection. The search term is concatenated into the query string. | `src/app/api/search/route.ts:10` | SEC-API-017 (BLOCKER, free) | Free |
| F06 | The payment webhook checks the signature but carries on when it does not match, then upgrades the plan. It also ignores the amount and the event id, so replays work. | `src/app/api/webhooks/payfake/route.ts:16` | SEC-API-101 (BLOCKER, free)<br>SEC-API-126 (BLOCKER, free)<br>SEC-API-127 (CRITICAL, free)<br>SEC-API-128 (CRITICAL, free) | Free |
| F07 | Server side request forgery. The import route fetches any URL a user sends. | `src/app/api/notes/import-url/route.ts:14` | SEC-API-035 (CRITICAL, free) | Free |
| F08 | A signing secret is hardcoded in source as a plain string assignment. | `src/lib/config.ts:2` | SEC-SECRETS-004 (BLOCKER, free) | Free |
| F09 | Admin access is checked only in the browser and in middleware. The admin API accepts any signed in user, and the middleware only looks for a cookie. | `src/app/api/admin/users/route.ts:9`<br>`src/app/admin/page.tsx:31`<br>`src/middleware.ts:9` | SEC-AUTHZ-020 (BLOCKER, free)<br>SEC-AUTHZ-002 (BLOCKER, free)<br>SEC-API-027 (CRITICAL, free) | Free |
| F10 | A client component builds a database client with the service role key, read from a public environment variable. | `src/components/AdminStats.tsx:10`<br>`src/lib/adminClient.ts:4` | SEC-SECRETS-003 (BLOCKER, free)<br>SEC-SECRETS-001 (BLOCKER, free) | Free |
| F11 | The login route writes the new session token to the logs. | `src/app/api/auth/login/route.ts:24` | SEC-LOG-001 (CRITICAL, free) | Free |
| F12 | CORS reflects any request origin and allows credentials on every API route. | `src/middleware.ts:19` | SEC-WEB-022 (CRITICAL, free) | Free |
| F13 | An AI tool reads a note by id using the app's full database access, with no check that the caller owns it. | `src/lib/ai/tools.ts:11` | SEC-AI-020 (BLOCKER, free)<br>SEC-AI-021 (CRITICAL, free) | Free |
| F14 | Prompt injection into tool calls. Untrusted note text sits in the same prompt as the instructions, and any tool the model names runs at once, including one that sends data out. Free catches the core issue, Pro adds the confirmation rule. | `src/app/api/ai/assistant/route.ts:41`<br>`src/lib/ai/tools.ts:17` | SEC-AI-017 (CRITICAL, free) | Free catches the core, Pro adds |
| F15 | The CI workflow puts the pull request title straight into a shell step, on a trigger that runs with repository secrets. | `.github/workflows/ci.yml:20` | SEC-SUPPLY-032 (CRITICAL, free) | Free |

## Pro only findings

12 of these flaws trip no Free edition requirement, so a Free audit passes over them. Three (P07, P12 and P13) are also caught by a Free requirement and are marked in the last column. A Pro audit reports all 15.

| # | Flaw | Where | Hullproof IDs (severity, edition) | Caught by |
|---|------|-------|------|------|
| P01 | No rate limit and no lockout on login, so passwords can be guessed without limit. | `src/app/api/auth/login/route.ts:17` | Pro edition requirements | Pro only |
| P02 | Passwords only need six characters and are never checked against a breached list. | `src/app/api/auth/signup/route.ts:7` | Pro edition requirements | Pro only |
| P03 | The session cookie has no Secure or HttpOnly flag and no host prefix. | `src/app/api/auth/login/route.ts:28` | Pro edition requirements | Pro only |
| P04 | No security headers are sent: no CSP, no frame protection, no nosniff, no referrer policy. | `next.config.js:3` | Pro edition requirements | Pro only |
| P05 | Errors go back to the client with the message and the full stack trace. | `src/lib/http.ts:21` | Pro edition requirements | Pro only |
| P06 | The app pins a Next.js release line that its vendor no longer supports. | `package.json:14` | Pro edition requirements | Pro only |
| P07 | There is no committed lockfile, and CI installs without enforcing one. | `package.json:8`<br>`.github/workflows/ci.yml:21` | Pro edition requirements<br>SEC-SUPPLY-002 (CRITICAL, free) | Pro, and Free through SEC-SUPPLY-002 |
| P08 | Third party actions are referenced by version tag, not by commit. | `.github/workflows/ci.yml:25`<br>`.github/workflows/ci.yml:15` | Pro edition requirements | Pro only |
| P09 | The CI token is granted write access to everything for every job. | `.github/workflows/ci.yml:9` | Pro edition requirements | Pro only |
| P10 | Model calls have no input size cap, no output token cap and no timeout. | `src/app/api/ai/assistant/route.ts:9`<br>`src/lib/ai/fakeModel.ts:9` | Pro edition requirements | Pro only |
| P11 | Uploads have no size limit and no file type check. Whatever the client sends is stored. | `src/app/api/files/route.ts:12` | Pro edition requirements | Pro only |
| P12 | Open redirect. The login response sends the user to whatever next value the request carried. | `src/app/api/auth/login/route.ts:25` | Pro edition requirements<br>SEC-AUTH-030 (CRITICAL, free) | Pro, and Free through SEC-AUTH-030 |
| P13 | Role changes and user deletions write no audit record. | `src/app/api/admin/users/route.ts:21` | Pro edition requirements<br>SEC-LOG-003 (CRITICAL, free) | Pro, and Free through SEC-LOG-003 |
| P14 | Users have no way to delete their own account from the app. Only the admin screen can remove a user. | `src/app/dashboard/page.tsx:98` | Pro edition requirements | Pro only |
| P15 | The notes list takes its page size from the query string with no maximum. | `src/app/api/notes/route.ts:11` | Pro edition requirements | Pro only |

## Also expect these

The code was built to make the planted flaws the main findings. A careful audit may still raise the points below. They are side effects of the design, not extra planted flaws.

| Point | Why it appears |
|-------|----------------|
| SEC-AUTHZ-021 (CRITICAL, free) | The admin area has no second factor, and so does the rest of the app. It follows from F09. |
| SEC-WEB-026 (CRITICAL, free) | State changing routes rely on a cookie. The cookie sets SameSite=Lax on purpose so this is not a planted flaw, but a reviewer may still ask for a forgery token. |
| SEC-AUTH-008 (BLOCKER, free) | The local seed creates three sample accounts. They are skipped when NODE_ENV is production and get random passwords nobody sees. |
| Runtime only checks | Several controls can only be settled by running the app. This demo was written and committed without installing or running it. |

## Not planted

The code does the following correctly on purpose, so an audit should pass these: parameterized queries everywhere except the search route, ownership checks on note edit, delete and file download, uploads served as attachments with nosniff, passwords hashed by the fake auth provider with scrypt, a per user daily request budget on the AI route, signature comparison in constant time, and no real secrets of any kind.
