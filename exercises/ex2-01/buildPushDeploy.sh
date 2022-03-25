#!/bin/bash

cd ./log-output/
./buildPushDeploy.sh

cd ..

cd ./pingpong/
./buildPushDeploy.sh


# tldr i need to cd into each folder 
