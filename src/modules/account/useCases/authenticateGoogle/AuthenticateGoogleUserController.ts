import { Request, Response } from "express";
import { AuthenticateGoogleUserUseCase } from "./AuthenticateGoogleUserUseCase";


class AuthenticateGoogleUserController {
    async handle(request: Request, response: Response) {

        const { code } = request.body;

        const authenticateGoogleUserUseCase = new AuthenticateGoogleUserUseCase();

        try {
            const result = await authenticateGoogleUserUseCase.execute(code);

            return response.json(result);

        } catch (error) {
            return response.json(error.message)
        }

    }
}

export { AuthenticateGoogleUserController };