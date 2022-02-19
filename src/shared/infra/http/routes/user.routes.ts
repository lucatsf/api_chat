import { Router } from "express";
import { ProfileUserController } from "../../../../modules/messages/useCases/profileUser/ProfileUserController";

const userRouter = Router();

const profileUserController = new ProfileUserController();

userRouter.get("/profile", profileUserController.handle);

export { userRouter };
