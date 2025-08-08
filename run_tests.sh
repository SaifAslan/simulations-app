#!/bin/sh

export CI=true
export NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL:-http://localhost:3030}

# # Run backend tests
# cd src/backend
# npm test || exit 1

# Run frontend tests
cd src/frontend
npm test || exit 1
