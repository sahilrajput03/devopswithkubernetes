#!/usr/bin/env bash
# ~Sahil, this file is inside the container image: jakousa/simple-backup-example
set -e

if [ $URL ]
then
  pg_dump -v $URL > /usr/src/app/backup.sql

  echo "Not sending the dump actually anywhere"
  # curl -F ‘data=@/usr/src/app/backup.sql’ https://somewhere
fi
