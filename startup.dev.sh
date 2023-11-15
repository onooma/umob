#!/usr/bin/env bash
set -e

/opt/wait-for-it.sh "$DATABASE_HOST:$DATABASE_PORT"
yarn start:prod
