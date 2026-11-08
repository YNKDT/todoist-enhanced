# Yannik's Todoist Enhanced deployment

Production: https://tasks.yannik-dittmann.workers.dev/
Cloudflare Worker: `tasks`.
Upstream: https://github.com/julesvbertolino/todoist-enhanced.git, branch `main`.

## Update requests

- Reply in German. A request to check for updates authorizes fetching and comparison only.
- Fetch upstream explicitly (`git fetch https://github.com/julesvbertolino/todoist-enhanced.git main`) and record the resulting `FETCH_HEAD` SHA immediately. Compare that SHA with HEAD, package.json and CHANGELOG.md. In a fork, origin is the user's fork, not upstream.
- Report versions, relevant changes, and whether upstream changes `wrangler.jsonc`, `public/_headers`, or `public/.assetsignore`.
- Install and deploy only once the user requests or approves it. Approval for the current update covers the entire backup, merge, build, deploy and verification sequence; do not ask again for each step.
- Before updating, back up the three configuration files plus `git diff --binary` outside the working tree. Inspect all local modifications. Never discard user changes.
- Merge the reviewed upstream SHA (a fork has its own configuration commits, so fast-forward may be impossible). Stop on conflicts and report affected files; do not overwrite them or force-reset.
- Preserve Worker name `tasks`, global `X-Robots-Tag: noindex, nofollow`, and `.htaccess` in `public/.assetsignore`. Keep all upstream security headers.
- Run `npm install`, then `PUBLIC_URL=https://tasks.yannik-dittmann.workers.dev/ npm run build`.
- Run `node scripts/verify-tasks-deployment.mjs` before deployment. A failed check blocks deployment.
- Deploy with `npx wrangler@4.158.0 deploy`. Use Cloudflare credentials configured in the cloud environment. Never print credentials or put them in repository files.
- Run `node scripts/verify-tasks-deployment.mjs --live` after deployment. It checks the local configuration, live status codes, deployed HTML, OAuth metadata, and security headers.
- Save the resulting update to the user's fork so future cloud tasks start at the updated version. Never push to the original author's repository. If saving fails, report it separately from deployment success.
- Follow the user's established validation scope: build and HTTP verification; do not run `npm test` or claim browser/login verification unless separately requested. Remind the user to check the UI and login.

## Cloud setup

See `docs/CODEX-CLOUD.md`. The production configuration files must be committed to the user's fork alongside this file and the verification script. Local uncommitted files do not transfer automatically to a GitHub checkout in Codex Cloud.
