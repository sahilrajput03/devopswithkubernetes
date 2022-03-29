#!/bin/bash
alias dk='docker'
alias kc='kubectl'
alias kd='kubectl delete -f'
shopt -s expand_aliases

kd ./log-output/manifests/
kd ./pingpong/manifests/
