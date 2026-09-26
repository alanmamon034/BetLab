# BetLab — Deliberately Vulnerable Betting-Themed App (Lab Use Only)

A self-hosted lab for practicing credential/secret-leak research and
web app misconfiguration hunting. Fake money, fake secrets, your own
Vercel deployment. Do not point any scanning tool at anything except
this deployment.

## What's intentionally broken (don't peek if you want the practice)

1. A secret leaked into client-side JS via a `NEXT_PUBLIC_` env var.
2. An exposed `/api/debug` route that echoes environment info.
3. Broken access control on `/api/admin/users` (auth check is too weak).
4. A `.env` file that gets committed, then deleted — but is still
   recoverable from git history.
5. A mock M-Pesa (Daraja) deposit flow at `/deposit` that leaks its
   consumer key client-side via `NEXT_PUBLIC_`, and a `/api/mpesa/debug`
   route gated only by a static token passed in the URL query string.

## Setup

1. `npm install`
2. Copy `.env.example` to `.env.local` and fill in values (or attach
   Vercel Postgres in the dashboard, which auto-injects `POSTGRES_URL`).
3. `npm run dev` to run locally on http://localhost:3000
4. Push to your own GitHub repo, import into Vercel, attach a Postgres
   database from the Vercel Storage tab, redeploy.

## Practice checklist (do these after it's deployed)

- [ ] View page source on `/` and find the leaked odds API key
- [ ] Hit `/api/debug` directly and see what it reveals
- [ ] Hit `/api/admin/users` while logged in as a normal (non-admin)
      user and see if you can read other users' data
- [ ] Run `gitleaks detect` against your repo
- [ ] Delete `.env` from the repo in a later commit, then use
      `git log --all --full-history -- .env` to recover it anyway
- [ ] Run `trufflehog filesystem .` against a local clone
- [ ] Run `nuclei -u <your-vercel-url>` with the exposed-panel /
      exposed-file templates once you're comfortable
- [ ] Find the leaked Daraja consumer key in the `/deposit` page's JS
- [ ] Find and query `/api/mpesa/debug` — figure out the token isn't
      actually needed to notice the endpoint exists, then try guessing it
