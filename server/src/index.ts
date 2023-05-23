import express, { Request, Response } from 'express';
import 'source-map-support/register';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import 'reflect-metadata';
import { Server } from 'socket.io';
import { EventEmitter } from 'events';

import KafkaConfig from './utils/KafkaConfig';
import { ChatModule } from './modules/chat';

const TOPIC_NAME = 'test';
const app = express();
const port = process.env.PORT; // default port to listen

dotenv.config();

export async function init() {
  const event = new EventEmitter();
  event.setMaxListeners(150);

  await KafkaConfig.init(TOPIC_NAME);

  app.use(cors({ origin: '*' }));
  app.use(morgan('dev'));

  app.get('/', (_: Request, res: Response) => {
    res.send('Hello words!');
  });

  app.use(express.json());
  app.use('/api/chat', new ChatModule().getRoutes());

  // receive message
  KafkaConfig.receiveMessage(TOPIC_NAME, (data: Object) => {
    console.log({ data });
    event.emit('trigger', JSON.stringify(data));
  });

  // start the Express server
  const server = app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
  });

  const io = new Server(server, { cors: { origin: '*' } });

  io.on('connection', (socket) => {
    event.on('trigger', (data) => {
      socket.emit('message', { data });
    });

    socket.on('disconnect', () => {
      console.log('disconnected!!!');
    });
  });
}

init();
