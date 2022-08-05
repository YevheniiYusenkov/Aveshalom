import dotenv from 'dotenv';
import express from 'express';
import { io } from 'socket.io-client';

dotenv.config({ path: __dirname + '/.env' });

const app = express();
const port = process.env.PORT || 3000;
const queueUrl = process.env.QUEUE_URL || '';

const client = io(queueUrl, {});

let isWorking = false;

app.listen(port, () => {
	console.log(`Service A listening at port: ${port}`);
	
	client.on('job', (job: { name: string, id: string, payload: any[] }) => {
		isWorking = true;
		console.log(`Start processing job #${job.id}`);
		setTimeout(() => {
			if (job.name === 'sum') {
				console.log(`Service A done this job #${job.id}: ${job.payload.reduce((prev, current) => prev + current)}`);
			}
			isWorking = false;
		}, Math.random() * (5000 - 2000) + 2000);
	});
	
	setInterval(() => {
		if (!isWorking) {
			client.emit('get-job', { queue: 'serviceA' });
		}
	}, 1000)
})
