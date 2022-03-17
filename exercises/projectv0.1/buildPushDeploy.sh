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

# I am deleting and recreating coz i want tag to be `latest` only:
kc delete deploy ex1.01-dep 2> /dev/null

# update deploy
kc apply -f manifests/deployment.yaml


# VERIFY:
# kc logs -f projectv1.01-dep<TAB>

# TEST PORT FORWARD:
#Ex1.05:
# kc port-forward projectv1.01-dep-664d94b6dd-rrglc 3001:3000
# FYI: (host:container) => (3001:3000) 

# FYI:
# `kc apply` is used instead of `kc create` when you want to create from a yaml file.
# kc create deploy dep-projectv1.01 --image=sahilrajput03/projectv1.01

# A BASIC WORKFLOW:
# ================
# Your basic workflow may look something like this:

# docker build -t <image>:<new_tag>

# docker push <image>:<new_tag>
# Then edit deployment.yaml so that the tag is updated to the <new_tag> and

# kubectl apply -f manifests/deployment.yaml
