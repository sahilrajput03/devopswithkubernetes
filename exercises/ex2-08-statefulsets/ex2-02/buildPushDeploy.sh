#!/bin/bash
alias dk='docker'
shopt -s expand_aliases

# Show commands before running:
set -o xtrace
# src: https://stackoverflow.com/a/5750463/10012446

###### PROGRAM #####
# Build and push image
dk build . -t sahilrajput03/ex2-02-img
dk image push sahilrajput03/ex2-02-img
