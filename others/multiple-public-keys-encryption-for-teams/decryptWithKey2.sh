#!/bin/bash
# PLEASE RUN THIS FILE via `source _this_file_name_`
export SOPS_AGE_KEY_FILE=$(pwd)/key2.txt
sops -d secret.enc.txt > revealed2.txt
