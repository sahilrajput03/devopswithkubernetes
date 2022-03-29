#!/bin/bash

alias ka='kubectl apply -f'
shopt -s expand_aliases

ka log-output/manifests/
ka pingpong/manifests/

# OR you I could have done:
# kc apply -f log-output/manifests/ -f pingpong/manifests/

# OR:
# ka log-output/manifests/,pingpong/manifests/
