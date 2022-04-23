#!/bin/bash

############### Create key, encrypt and apply using age-key sops
###### KEY GENERATION:
# age-keygen -o age.agekey
# I stored above file at ~/sops/age/age.agekey and using SOPS_AGE_KEY_FILE to store this file's path so i can use this same file to encrypt decrypt without passing its path to sops each time when I need ot encrypt or decrypt.

###############IMPORATANT##IMPORTANT##IMPORTANT## Add secret key (PRIVATE_KEY) to cluster
#### The key name must end with .agekey to be detected as an age key: src: https://fluxcd.io/docs/guides/mozilla-sops/#encrypting-secrets-using-age
# cat $SOPS_AGE_KEY_FILE | kubectl create secret generic sops-age --namespace=flux-system --from-file=age.agekey=/dev/stdin
#### where I have SOPS_AGE_KEY_FILE variable has value: ~/sops/age/age.agekey

#Veryfy
kc get secrets -n flux-system sops-age

###### ENCRYPTING EACH SECRET YAML FILE
# sops -e --encrypted-regex '^(data|stringData)$' -i basic-auth.yaml
### -e is alias for --encrypt
### -i is alias for --in-place editing of a file, SRC: sops --help
### Q.Why do we use --encrypted-regex ?
### Ans. => Encrypting parts of file only: https://github.com/mozilla/sops#48encrypting-only-parts-of-a-file

## IMPORTANT: src: https://fluxcd.io/docs/guides/mozilla-sops/#encrypting-secrets-using-openpgp
# Note that you shouldn’t apply the encrypted secrets onto the cluster with kubectl. SOPS encrypted secrets are designed to be consumed by kustomize-controller(i.e., kustomize controller of flux ~Sahil).

