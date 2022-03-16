#!/bin/bash
source ~/.bash_aliases
shopt -s expand_aliases

# Show commands before running:
set -o xtrace
# src: https://stackoverflow.com/a/5750463/10012446

###### PROGRAM #####
# Build and push image
dk build . -t sahilrajput03/projectv1.01
dk image push sahilrajput03/projectv1.01

# IMPORTANT:
# kc create deploy dep-projectv1.01 --image=sahilrajput03/projectv1.01

# update deploy
kc apply -f manifests/deployment.yaml
