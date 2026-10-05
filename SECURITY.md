# Security

## The flaws in this repository are deliberate

hullproof demo is a teaching and demonstration project. The vulnerabilities in it were planted on purpose and are listed in `DEMO-ANSWER-KEY.md`. They are not accidents, and they will not be fixed, because fixing them would remove the point of the project.

## What to report

Please do not report the planted flaws. They are already known.

Do report anything that goes beyond the intent of the project, for example a real credential, a real person's data, a link to a real service, or a flaw that could harm someone who only reads or clones the repository. Send it to joshua@joshuatheophilus.com with the file and line.

## Safe use

Never deploy this app. Never use real data, real accounts or real keys with it. Keep it on one machine, bound to 127.0.0.1. All values in the repository are made up, including the placeholder secret in `src/lib/config.ts`.
