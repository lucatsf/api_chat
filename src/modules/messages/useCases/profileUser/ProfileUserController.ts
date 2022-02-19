import { Request, Response } from 'express';
import { ProfileUseCase } from './ProfileUseCase';

export class ProfileUserController {
  async handle(request: Request, response: Response) {

    const profileUseCase = new ProfileUseCase();

    const id = request.user_id;

    const result = await profileUseCase.execute(id);

    return response.json(result);
  }
}
