#!/bin/sh
# param: dns of ec2 instance

ssh -i ~/keys/habit-tracker-ec2.pem ec2-user@$1 "rm -rf current"

scp -r -i ~/keys/habit-tracker-ec2.pem dist ec2-user@$1:current

scp -r -i ~/keys/habit-tracker-ec2.pem ecosystem.config.js ec2-user@$1:current/

scp -r -i ~/keys/habit-tracker-ec2.pem package.json ec2-user@$1:current/

ssh -i ~/keys/habit-tracker-ec2.pem ec2-user@$1 "cd current; npm install --only=prod; pm2 startOrRestart ecosystem.config.js"