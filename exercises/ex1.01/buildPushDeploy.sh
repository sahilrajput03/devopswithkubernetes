#!/bin/bash
alias dk='docker'
alias kc='kubectl'
shopt -s expand_aliases

# Show commands before running:
set -o xtrace
# src: https://stackoverflow.com/a/5750463/10012446

###### PROGRAM #####
# Build and push image
dk build . -t sahilrajput03/ex1.01
dk image push sahilrajput03/ex1.01

# I am deleting and reacreating coz i want tag to be `latest` only:
kc delete deploy ex1.01-dep 2> /dev/null

# update deploy
kc apply -f manifests/deployment.yaml

# VERIFY:
# kc logs -f ex1.01<TAB>


# FYI:
# `kc apply` is used instead of `kc create` when you want to create from a yaml file.
# kc create deploy dep-projectv1.01 --image=sahilrajput03/projectv1.01
