import { Router } from "express";
import { CreateMessageController } from "../../../../modules/messages/useCases/createdMessage/CreateMessageController";
import { ListMessagesController } from "../../../../modules/messages/useCases/listMessages/ListMessagesController";

const messageRouter = Router();

const createMessageController = new CreateMessageController();
const listMessagesController = new ListMessagesController();

messageRouter.post("/", createMessageController.handle)
messageRouter.get("/", listMessagesController.handle)

export { messageRouter };
