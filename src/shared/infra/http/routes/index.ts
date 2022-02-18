import { Router } from "express";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

import { authenticate } from "./authenticate.routes";
import { messageRouter } from "./message.routes";
import { googleAuthenticate } from "./googleAuthenticate.routes";

const router = Router();

router.use("/authenticate", authenticate);
router.use("/", googleAuthenticate);
router.use("/message", ensureAuthenticated, messageRouter);


export { router };
