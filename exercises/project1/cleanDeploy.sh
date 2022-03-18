#!/bin/bash

shopt -s expand_aliases
alias kc='kubectl'

kc delete deploy project1-dep 2> /dev/null
kc delete svc project1-svc 2> /dev/null
kc delete ing project1-ing 2> /dev/null
