#!/usr/bin/env bash
# Deploy falhad.dev to the production server.
#
# Syncs the working tree, installs deps, builds Next.js, and restarts the
# systemd service. Run from anywhere: ./scripts/deploy.sh
#
# Server layout (already provisioned):
#   /var/www/falhad.dev            app source
#   falhad-app.service (systemd)   runs `npm start` on 127.0.0.1:3000
#   nginx falhad.dev + www         reverse-proxies :3000, TLS via certbot
set -euo pipefail

SERVER="${DEPLOY_SERVER:-root@72.60.129.41}"
REMOTE_DIR="${DEPLOY_DIR:-/var/www/falhad.dev}"
LOCAL_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "==> Syncing $LOCAL_DIR -> $SERVER:$REMOTE_DIR"
rsync -az --delete \
  --exclude node_modules --exclude .next --exclude .git \
  --exclude .idea --exclude .playwright-mcp --exclude .superpowers \
  --exclude 'tsconfig.tsbuildinfo' \
  "$LOCAL_DIR"/ "$SERVER:$REMOTE_DIR"/

echo "==> Installing, building, restarting on server"
# --legacy-peer-deps: react-day-picker@8 pins react 18, project is on react 19.
ssh "$SERVER" "cd $REMOTE_DIR \
  && npm ci --legacy-peer-deps \
  && npm run build \
  && systemctl restart falhad-app \
  && sleep 3 \
  && systemctl is-active falhad-app"

echo "==> Verifying https://falhad.dev"
curl -fsS -o /dev/null -w "HTTP %{http_code}\n" https://falhad.dev
echo "==> Done."
