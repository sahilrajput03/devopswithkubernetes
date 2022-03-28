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

# create/update deploy with nodeport service:
# kc apply -f ./manifests-nodeport


# ONLY DEPLOY:
# kc apply -f manifests/deployment.yaml

# VERIFY:
# kc logs -f project1-dep<TAB>

# TEST PORT FORWARD:
#Ex1.05:
# kc port-forward project1-dep-664d94b6dd-rrglc 3001:3000
# FYI: (host:container) => (3001:3000) 

# FYI:
# `kc apply` is used instead of `kc create` when you want to create from a yaml file.
# kc create deploy dep-project1 --image=sahilrajput03/project1

# A BASIC WORKFLOW:
# ================
# Your basic workflow may look something like this:

# docker build -t <image>:<new_tag>

# docker push <image>:<new_tag>
# Then edit deployment.yaml so that the tag is updated to the <new_tag> and

# kubectl apply -f manifests/deployment.yaml
