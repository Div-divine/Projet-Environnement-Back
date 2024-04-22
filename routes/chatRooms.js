import { Router } from "express";
import verifyToken from "../middlewares/webtokenMiddleware.js";
import createChatroom from "../middlewares/ChatRoomAccessMiddleware.js";

const router = Router();

router.post('/', verifyToken, createChatroom, (req, res, next) =>{
  //Tout est fait dans le middleware createChatroom
})
export default router;