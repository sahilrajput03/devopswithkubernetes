#!/bin/bash
# PLEASE RUN THIS FILE via `source _this_file_name_`
export SOPS_AGE_KEY_FILE=$(pwd)/key3.txt
sops -d secret.enc.txt > revealed3.txt
