#!bin/bash

while true 
do
	curl http://localhost:3000/api/mine-transactions
	sleep 0.5;
done
