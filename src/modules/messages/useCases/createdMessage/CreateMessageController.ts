import { Request, Response } from 'express';
import { CreateMessageUseCase } from './CreateMessageUseCase';

export class CreateMessageController {
  async handle(request: Request, response: Response) {
    const { message } = request.body;

    const { user_id } = request;

    const createMessageUseCase = new CreateMessageUseCase();

    const result = await createMessageUseCase.execute(message, user_id);

    return response.json(result);
  }
}
