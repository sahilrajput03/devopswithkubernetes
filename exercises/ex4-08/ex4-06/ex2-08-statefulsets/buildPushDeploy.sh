#!/bin/bash
alias dk='docker'
alias kc='kubectl'
shopt -s expand_aliases

# Show commands before running:
set -o xtrace
# src: https://stackoverflow.com/a/5750463/10012446

###### PROGRAM #####
# FOR (backend, i.e., storing todos) ex2-02 image building:
cd ex2-02
dk build . -t sahilrajput03/ex2-02-img
dk image push sahilrajput03/ex2-02-img
cd ..

# (frontend) Build and push image
cd project1
dk build . -t sahilrajput03/project1-img
dk image push sahilrajput03/project1-img
cd ..

# I am deleting and recreating coz i want tag to be `latest` only:
kc delete -f manifests/ 2> /dev/null

# create/update deploy with ingress + clusterip service
kc apply -f manifests/
