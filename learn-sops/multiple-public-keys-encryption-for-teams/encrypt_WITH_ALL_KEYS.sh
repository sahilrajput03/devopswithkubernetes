#!/bin/bash
# This is used for encryption only!
# This key is a comma-separated list of public keys (from `sops -h`)
export SOPS_AGE_RECIPIENTS=age159wkwzjehnn3pdds79avskt38wj8dcl3j88mejpsgq3xuq3xe9lq89wuxf,age1hr3y5syuu6gung4y2anq7ctuen0w7hacqt8zlt36gm9jun098f6szxcpnm,age1wepjj264tfl9u44dmnm2aljlv547gfkqvzph0ghp7fkqqxkx3s9s58q4sk
sops --encrypt secret.txt > secret.enc.txt

# FYI: sops uses SOPS_AGE_RECIPIENTS key to pass value to --age or -a option while encrypting.
