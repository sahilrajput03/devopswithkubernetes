#!/usr/bin/env bash
# FYI: This script's commands workd (but only manually tested for now)
alias kResetCluster='k3d cluster delete; k3d cluster create --port 8082:30080@agent:0 -p 8081:80@loadbalancer --agents 2; docker exec k3d-k3s-default-agent-0 mkdir -p /tmp/kube'

shopt -s expand_aliases
set -x

# Recreate cluster
kResetCluster

# This will clone the repo and will apply it to currently running cluster.
flux bootstrap github --owner=sahilrajput03 --repository=kube-cluster-dwk --personal --private=false
