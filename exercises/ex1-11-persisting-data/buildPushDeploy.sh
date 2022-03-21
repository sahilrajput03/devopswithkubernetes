#!/bin/bash
alias dk='docker'
alias kc='kubectl'
shopt -s expand_aliases

# Show commands before running:
set -o xtrace
# src: https://stackoverflow.com/a/5750463/10012446

###### PROGRAM #####
# Build and push image
APP=log-output-img
dk build log-output/ -t sahilrajput03/$APP
dk image push sahilrajput03/$APP

APP=pingpong-img
dk build pingpong/ -t sahilrajput03/$APP
dk image push sahilrajput03/$APP

# I am deleting and recreating coz i want tag to be `latest` only:
kc delete -f ./manifestsPersistent/ 2> /dev/null

# update deploy with ingress + cluterIP service
kc apply -f ./manifestsPersistent/

# VERIFY:
# kc logs -f ex1-01<TAB>


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
