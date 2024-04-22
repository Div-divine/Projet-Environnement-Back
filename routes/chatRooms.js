import { Router } from "express";
import verifyToken from "../middlewares/webtokenMiddleware.js";
import createChatroom from "../middlewares/ChatRoomAccessMiddleware.js";
import getchatRoomId from "../middlewares/GetChatRoomIdMiddleware.js";

const router = Router();

router.post('/', verifyToken, createChatroom, (req, res, next) => {
  //Tout est fait dans le middleware createChatroom
})

router.get('/chatroom-id', verifyToken, getchatRoomId, (res, req, next) => {
  //Tout est fait dans le middleware createChatroom
})

export default router;