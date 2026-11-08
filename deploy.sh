#!/bin/sh
set -eu

cd "$(dirname "$0")"

if [ "$#" -gt 1 ]; then
  printf '%s\n' 'Usage: npm run deploy [-- <new-app-name-or-current-hostname>]' >&2
  exit 1
fi

if ! sh scripts/meteor.sh whoami >/dev/null; then
  printf '%s\n' 'Sign in first: sh scripts/meteor.sh login' >&2
  exit 1
fi

exec node scripts/deploy.mjs "$@"
