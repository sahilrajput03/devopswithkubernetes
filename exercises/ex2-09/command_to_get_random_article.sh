#!/bin/bash
# DBUS_SESSION_BUS_ADDRESS=unix:path=/run/user/1000/bus 
# echo Read: $(curl -sI "https://en.wikipedia.org/wiki/Special:Random" | grep location | sed -E 's/location: //')
article=$(curl -sI 'https://en.wikipedia.org/wiki/Special:Random' | grep location | sed -E 's/location: //')
export DISPLAY=:1
echo boom
date
notify-send "Read: " "${article}"
## You may choose to run this file via `crontab -e` by adding below entry to get a reading article every single minute. :LOL:
# * * * * * DBUS_SESSION_BUS_ADDRESS=unix:path=/run/user/1000/bus /home/array/Documents/github_repos/devopswithkubernetes/exercises/ex2-09/command_to_get_random_article.sh >> /tmp/cronlog-01.txt
# The reasony why I have put ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ is coz notifications send via cronjob aren't working withou them!
# src: https://askubuntu.com/a/1308769/702911
