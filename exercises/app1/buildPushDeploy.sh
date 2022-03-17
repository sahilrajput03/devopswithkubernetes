#!/bin/bash
alias dk='docker'
alias kc='kubectl'
shopt -s expand_aliases

# Show commands before running:
set -o xtrace
# src: https://stackoverflow.com/a/5750463/10012446

###### PROGRAM #####
kc create deployment hashgenerator-dep --image=jakousa/dwk-app1


# A BASIC WORKFLOW:
# ================
# Your basic workflow may look something like this:

# docker build -t <image>:<new_tag>

# docker push <image>:<new_tag>
# Then edit deployment.yaml so that the tag is updated to the <new_tag> and

# kubectl apply -f manifests/deployment.yaml