import { Router } from "express";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

import { messageRouter } from "./message.routes";
import { googleAuthenticate } from "./googleAuthenticate.routes";
import { userRouter } from "./user.routes";

const router = Router();

router.use("/", googleAuthenticate);
router.use("/user", ensureAuthenticated, userRouter);
router.use("/message", ensureAuthenticated, messageRouter);


export { router };
