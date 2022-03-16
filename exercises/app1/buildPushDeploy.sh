#!/bin/bash
alias dk='docker'
alias kc='kubectl'
shopt -s expand_aliases

# Show commands before running:
set -o xtrace
# src: https://stackoverflow.com/a/5750463/10012446

###### PROGRAM #####
kc create deployment hashgenerator-dep --image=jakousa/dwk-app1