#!/bin/sh
# param: dns of ec2 instance

ssh pi@192.168.0.67 "rm -rf current"

scp -r dist pi@192.168.0.67:current

scp -r ecosystem.config.js pi@192.168.0.67:current/

scp -r package.json pi@192.168.0.67:current/

ssh pi@192.168.0.67 "cd current; npm install --only=prod; pm2 startOrRestart ecosystem-pi.config.js"