## Node.js

- Installed at `~/.local/node/bin/node` (v20.19.0)
- PATH added in `~/.zshenv` and `~/.zshrc`
- Run: `node server.mjs`

## Onchain OS CLI

- Installed at `~/.local/bin/onchainos` (v4.2.1)
- PATH added in `~/.zshenv` and `~/.zshrc`
- Preflight passes — wallet login ready

## Project: LedgerPilot ASP

- Backend runs on port 8080
- Server: `server.mjs` (dependency-free Node.js)
- Uses `src/` modules (onchainos.mjs, app.mjs, store.mjs, etc.)
- **Stopped**: `kill $(lsof -ti :8080)`
- **Status**: http://127.0.0.1:8080/

## Git / SSH

- GitHub: `Mrcube3`
- SSH key at `~/.ssh/id_ed25519` — added to GitHub and ssh-agent
- Always use SSH remote URLs (`git@github.com:user/repo.git`)

## Vercel

- Project repo: `git@github.com:Mrcube3/AX.git`
- Vercel entry: `api/index.mjs` (serverless handler)
- Config: `vercel.json` routes all paths through the Node.js handler
- Locally: `node server.mjs` (uses `createApp` from `src/app.mjs`)
