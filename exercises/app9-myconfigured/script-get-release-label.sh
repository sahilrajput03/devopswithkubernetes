#!/bin/bash
prometheusResource=$(kubectl -n prometheus get prometheus | tail -n1 | awk '{print $1}')
kubectl -n prometheus describe prometheus $prometheusResource | grep -A 2 'Service Monitor Selector' | tail -n 1 | awk '{print $2}'
