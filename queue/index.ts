import dotenv from 'dotenv';
dotenv.config({ path: __dirname + '/.env' });

import { v4 as uuid } from 'uuid';

import { Server, Socket } from 'socket.io';

const server = new Server();
const port = parseInt(process.env.PORT as string) || 6000;

const queues: any = {};

let currentJobId = 0;

server.on('connection', (socket: Socket) => {
	console.log(`Connected: ${socket.id}`);
	
	socket.on('create-queue', (message: { queue: string }) => {
		if (!queues[message.queue]) {
			queues[message.queue] = {
				jobs: [],
				index: 0,
			};
		}
	})
	
	socket.on('create-job', (message: { queue: string, job: any }) => {
		if (queues[message.queue]) {
			message.job.id = ++currentJobId;
			queues[message.queue].jobs.push(message.job);
			console.log(queues[message.queue].jobs.length);
		}
	});
	
	socket.on('get-job', (message: { queue: string }) => {
		if (queues[message.queue] && queues[message.queue].jobs.length > 0) {
			const job = queues[message.queue].jobs.pop();
			const count = queues[message.queue].jobs.length;
			socket.emit('job', job);
			console.log(`Sent job to socket ${socket.id}, job #${job.id}: jobs count ${count}`);
		}
	});
});

server.listen(port);
