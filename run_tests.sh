#!/bin/sh

export CI=true
cd src/frontend
npm test ${@}
