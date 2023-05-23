import { Request, Response } from 'express';
import KafkaConfig from '../../utils/KafkaConfig';
import { ResponseUtils } from '../../utils/ResponseUtils';

export class ChatController {
  async sendChatMessage(req: Request, res: Response) {
    const data = req.body;
    const success = await KafkaConfig.sendMessage(KafkaConfig.topicName, data);

    return ResponseUtils.respondSuccess(res, {
      statusCode: 200,
      data: success[0],
    });
  }
}
