#!/bin/bash
# Change paths below!!

NAME=server

if [[ $UID != 0 ]]; then
	echo "Run as root!"
	exit 1
fi

kill `ps -ef | grep "node /home/ubuntu/The-Tangibles/server.js" | grep -v grep | awk '{print $2}'`
screen -S $NAME -X quit
for session in $(screen -ls | grep -o `echo [0-9]*\.$NAME`); do screen -S "${session}" -X quit; done

cd /home/ubuntu/The-Tangibles && git pull
screen -d -m -S $NAME -t nodejs
screen -S $NAME -p nodejs -X stuff "node /home/ubuntu/The-Tangibles/server.js$(printf \\r)"
