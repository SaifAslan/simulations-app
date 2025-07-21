#!/bin/sh

export CI=true

# # Run backend tests
# cd src/backend
# npm test || exit 1

# Run frontend tests
cd ../src/frontend
npm test || exit 1
