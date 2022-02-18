import { Router } from "express";
import { AuthenticateUserController } from "../../../../modules/account/useCases/authenticateUser/AuthenticateUserController";

const authenticate = Router();

const authenticateUserController = new AuthenticateUserController();

authenticate.post("/", authenticateUserController.handle)


export { authenticate };
