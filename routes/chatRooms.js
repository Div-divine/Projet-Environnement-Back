import { Router } from "express";
import verifyToken from "../middlewares/webtokenMiddleware.js";
import createChatroom from "../middlewares/ChatRoomAccessMiddleware.js";
import getchatRoomId from "../middlewares/GetChatRoomIdMiddleware.js";
import enableOneChatrommPerPair from "../middlewares/EnableOnlyOneChatRoomPerPairOfUsers.js";
import addUserMessages from "../middlewares/userMessagesMiddleware.js";

const router = Router();

router.post('/', verifyToken, enableOneChatrommPerPair, createChatroom, (req, res, next) => {
  //Tout est fait dans le middleware createChatroom
});

router.get('/chatroom-id/:user1Id/:user2Id', verifyToken, getchatRoomId, (res, req, next) => {
  //Tout est fait dans le middleware createChatroom
});

router.post('/messages', verifyToken, addUserMessages, async (req, res, next) => {
  try {
    res.send('Message created succcessfully');
  } catch (error) {
    console.error('Chatroom not found:', error);
    res.status(500).json({ error: 'Internal server error' });
  }

});



export default router;