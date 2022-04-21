#!/bin/bash
alias dk='docker'
alias kc='kubectl'
shopt -s expand_aliases

# Show commands before running:
set -o xtrace
# src: https://stackoverflow.com/a/5750463/10012446

###### PROGRAM #####
# FOR broadcaster
dk build . -t sahilrajput03/broadcaster-project
dk image push sahilrajput03/broadcaster-project

# I am deleting and recreating coz i want tag to be `latest` only:
kc delete -f manifests/ 2> /dev/null

# create/update deploy with ingress + clusterip service
kc apply -f manifests/
