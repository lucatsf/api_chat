import { Request, Response } from 'express';
import { ListMessagesUseCase } from './ListMessagesUseCase';

export class ListMessagesController {
  async handle(request: Request, response: Response) {
    const { page, totalPage } = request.body;

    const listMessagesUseCase = new ListMessagesUseCase();

    const result = await listMessagesUseCase.execute({
        page,
        totalPage
    });

    return response.json(result);
  }
}
