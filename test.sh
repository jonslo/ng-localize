#!/bin/bash
set -e

echo "Running code linter (jshint)"
./node_modules/.bin/jshint source/
./node_modules/.bin/jshint specs/

echo "Running code style test (jscs)"
./node_modules/.bin/jscs source/ --reporter=inline
./node_modules/.bin/jscs specs/ --reporter=inline

echo "Running karma test suite"
./node_modules/karma/bin/karma start --single-run

