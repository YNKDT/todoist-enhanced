# Todoist Enhanced in Codex Cloud

Status: project files prepared locally. A GitHub fork, cloud environment and cloud credentials still need to be connected. Production currently runs 2.32.4; preparing this setup does not deploy again.

## Repository

Create a fork of https://github.com/julesvbertolino/todoist-enhanced under your own GitHub account. Commit these files to your fork:

- `AGENTS.md`
- `docs/CODEX-CLOUD.md`
- `scripts/verify-tasks-deployment.mjs`
- `wrangler.jsonc` (Worker name `tasks`)
- `public/_headers` (global `noindex, nofollow`)
- `public/.assetsignore` (`.htaccess`)

Keep the author's repository as upstream; use your fork for saving updates. Do not push your deployment configuration to the author's repository. Never commit credentials.

## Cloud environment

In Codex, choose **Work in > Cloud > Select environment > Create environment**, connect GitHub, and select your fork. Ask Codex to prepare Node.js 22, npm, Git and curl and run `npm ci`. Save and publish the environment.

Configure `PUBLIC_URL=https://tasks.yannik-dittmann.workers.dev/` and `CLOUDFLARE_ACCOUNT_ID` as environment variables. Add a dedicated Cloudflare API token as `CLOUDFLARE_API_TOKEN` using the environment's credential settings/personal vault, never in chat or source files. Use a token scoped to the intended Cloudflare account with the permissions required to deploy its Workers; validate it with Wrangler before enabling deployment. The local browser-based Wrangler login does not transfer to the cloud.

Allow package-manager hosts plus `github.com`, `api.cloudflare.com`, and `tasks.yannik-dittmann.workers.dev`. Add further destinations only if the environment's setup or Wrangler explicitly requires them. Check the environment's network policy and credential delivery with `npx wrangler@4.158.0 whoami` without printing the token. If using an HTTP/network secret, configure its allowed destination as `api.cloudflare.com` and verify Wrangler works with the proxy substitution; otherwise use the environment's supported secret variable mechanism.

Official setup and credential documentation: https://learn.chatgpt.com/docs/environments/cloud-environments

## First check

Start a new cloud task in the published environment:

> Lies AGENTS.md. Prüfe, dass dies mein Fork ist und meine Konfiguration vorhanden ist. Baue mit meiner PUBLIC_URL und prüfe mit node scripts/verify-tasks-deployment.mjs. Prüfe den Cloudflare-Zugang, ohne Secrets auszugeben. Noch nichts veröffentlichen.

Then use:

> Bitte prüfe nach Updates gemäß AGENTS.md. Noch nichts installieren.

After reviewing the result:

> Bitte installiere und veröffentliche das geprüfte Update gemäß AGENTS.md und speichere den Stand in meinem Fork.

The workflow records changes in the fork, backs up configuration before merging, stops on conflicts, and verifies the live deployment. The UI and Todoist login still need a manual browser check. No scheduled task is created by this setup.
