import { Router } from "express";
import verifyToken from "../middlewares/webtokenMiddleware.js";
import createChatroom from "../middlewares/ChatRoomAccessMiddleware.js";
import getchatRoomId from "../middlewares/GetChatRoomIdMiddleware.js";
import addUserMessages from "../middlewares/userMessagesMiddleware.js";
import ChatRoom from "../model/chatRommsModel.js";


const router = Router();

router.post('/', createChatroom, verifyToken, async (req, res) => {
});

router.get('/exists-chatroom/:user1Id/:user2Id', verifyToken, async (req, res) => {
  try {

    const { user1Id, user2Id } = req.params
    if (!user1Id) {
      return res.status(404).json({ status: 404, message: 'Unable to add first user' });
    }
    if (!user2Id) {
      return res.status(404).json({ status: 404, message: 'Unable to add second user' });
    }
    const exists = await ChatRoom.GetChatRommId(user1Id, user2Id);
    res.send(exists);
  } catch (error) {
    console.error('Chatroom not found:', error);
    res.status(500).json({ error: 'Internal server error' });
  }

});

router.get('/chatroom-id/:user1Id/:user2Id', getchatRoomId, verifyToken, (res, req, next) => {
  //Tout est fait dans le middleware createChatroom
});

router.post('/messages', addUserMessages, verifyToken, async (req, res, next) => {
  try {
    res.send('Message created succcessfully');
  } catch (error) {
    console.error('Chatroom not found:', error);
    res.status(500).json({ error: 'Internal server error' });
  }

});



export default router;