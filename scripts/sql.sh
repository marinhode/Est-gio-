#!/usr/bin/env bash
# Executa SQL no projeto Supabase pela API de gerenciamento (uso da equipe de desenvolvimento).
# O token de acesso é injetado pelo proxy do ambiente; fora dele, defina SUPABASE_ACCESS_TOKEN.
# Uso: scripts/sql.sh < arquivo.sql    ou    echo "select 1;" | scripts/sql.sh
set -euo pipefail
PROJETO="${SUPABASE_PROJECT_REF:-hmmrthhwchefxwshpphl}"
TOKEN="${SUPABASE_ACCESS_TOKEN:-proxy-injected}"
python3 -c 'import json,sys; print(json.dumps({"query": sys.stdin.read()}))' |
  curl -sS --max-time 120 -w ' [HTTP %{http_code}]\n' -X POST \
    -H "Authorization: Bearer ${TOKEN}" -H "Content-Type: application/json" \
    --data-binary @- "https://api.supabase.com/v1/projects/${PROJETO}/database/query"
