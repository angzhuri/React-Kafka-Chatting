import { Router } from 'express';
import { ChatController } from './chat.controller';

export class ChatModule {
  private controller = new ChatController();

  getRoutes(): Router {
    const router = Router();

    router.post('/send', this.controller.sendChatMessage);

    return router;
  }
}
