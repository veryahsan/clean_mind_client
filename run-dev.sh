#!/bin/bash
# Ensure we're using the correct Node version from .nvmrc
cd "$(dirname "$0")"
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use
npm run dev


