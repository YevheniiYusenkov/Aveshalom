This is just code jam. Queue with sockets.

Queue - app which can create queues and store jobs in this queues.

Service A - this app get jobs from queue and process it.

Service B - this app create new jobs and send it to queue.

run-services-a.bat - this script run 10 instances of "Service A" at ports: 4000, ..., 4009 

How to run it:

1. npm run start:queue
2. npm run start:service_b
3. Set absolute path to root dir in run-service-a.bat
4. Execute run-service-a.bat
5. Done. See the logs
