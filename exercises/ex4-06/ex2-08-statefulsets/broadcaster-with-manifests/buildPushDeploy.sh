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

# create/update deploy with nodeport service:
# kc apply -f ./manifests-nodeport


# FYI:
# ================
# `kc apply` is used instead of `kc create` when you want to create from a yaml file.
# kc create deploy dep-project1 --image=sahilrajput03/project1

# A BASIC WORKFLOW:
# ================
# Your basic workflow may look something like this:

# docker build -t <image>:<new_tag>

# docker push <image>:<new_tag>
# Then edit deployment.yaml so that the tag is updated to the <new_tag> and

# kubectl apply -f manifests/deployment.yaml
