import dotenv from 'dotenv';
import express from 'express';
import { io } from 'socket.io-client';

dotenv.config({ path: __dirname + '/.env' });

const app = express();
const port = process.env.PORT || 3000;
const queueUrl = process.env.QUEUE_URL || '';

const client = io(queueUrl, {});

app.use((req, res, next) => {
	let body = '';
	req.on('data', (chunk) => {
		body += chunk;
	})
	
	req.on('end', () => {
		req.body = JSON.parse(body);
		next();
	})
})

app.post('/jobs', (req, res) => {
	const { count } = req.body;
	for (let i = 0; i < count; i++) {
		client.emit('create-job', { queue: 'serviceA', job: { name: 'sum', payload: [Math.random() * 1000, Math.random() * 1000, Math.random() * 1000] }});
	}
	return res.end('New Job(s) created!');
});

app.listen(port, () => {
	console.log(`Service B listening at port: ${port}`);
	
	client.emit('create-queue', { queue: 'serviceA' });
})
