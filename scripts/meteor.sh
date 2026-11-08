#!/bin/sh
set -eu

if command -v meteor >/dev/null 2>&1; then
  exec meteor "$@"
elif [ -x "$HOME/.meteor/meteor" ]; then
  exec "$HOME/.meteor/meteor" "$@"
else
  printf '%s\n' 'Meteor is not installed. Run: npm install -g meteor@3.5.4' >&2
  exit 1
fi
