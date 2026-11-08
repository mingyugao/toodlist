#!/bin/sh
set -eu

cd "$(dirname "$0")"

if [ "$#" -ne 1 ]; then
  printf '%s\n' 'Usage: npm run deploy -- <unique-app-name>' >&2
  exit 1
fi

case "$1" in
  ''|*[!a-z0-9-]*|-*|*-)
    printf '%s\n' 'Use a lowercase app name containing letters, numbers and internal hyphens.' >&2
    exit 1
    ;;
esac

if [ "${#1}" -gt 63 ]; then
  printf '%s\n' 'The app name must be at most 63 characters.' >&2
  exit 1
fi

if ! sh scripts/meteor.sh whoami >/dev/null; then
  printf '%s\n' 'Sign in first: sh scripts/meteor.sh login' >&2
  exit 1
fi

# Galaxy provisions a fresh database on the first deployment. Later deployments
# retain the existing MONGO_URL and stored data. The plan is explicitly free.
exec sh scripts/meteor.sh deploy "$1" --plan free --mongo
