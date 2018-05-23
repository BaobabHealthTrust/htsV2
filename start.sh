#!/bin/bash

PM2=$(which pm2);

if [ ${#PM2} -eq 0 ]; then

    echo "Install 'pm2' first to proceed.";

    exit 1;

fi

cd redis;

pm2 start process.json;

cd ..

pm2 start process.json;
