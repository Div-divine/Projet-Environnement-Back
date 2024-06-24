import { Router } from "express";
import verifyToken from "../middlewares/webtokenMiddleware.js";
import createChatroom from "../middlewares/chatRoomAccessMiddleware.js";
import getchatRoomId from "../middlewares/getChatRoomIdMiddleware.js";
import addUserMessages from "../middlewares/userMessagesMiddleware.js";
import ChatRoom from "../model/chatRommsModel.js";


const router = Router();

router.post('/', createChatroom, verifyToken, async (req, res) => {
  try {
    const userIdFromToken = req.userId
    const { user1Id, user2Id } = req.body;
    // ensure user creating chatroom is the user connected
    if (user1Id != userIdFromToken && user2Id != userIdFromToken) {
      return res.status(401).json({ message: 'Unauthairized action, unknown user creating chatroom!' })
    }
    if (user1Id == userIdFromToken || user2Id == userIdFromToken) {
      // Create a new chatroom
      const chatroom = await ChatRoom.createChatRoom(user1Id, user2Id);
      res.status(201).json({ status: 201, message: 'Chatroom created successfully', chatroom });
    }
  } catch (error) {
    console.error('Chatroom not found:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/exists-chatroom/:user1Id/:user2Id', verifyToken, async (req, res) => {
  try {
    const userIdFromToken = req.userId
    const { user1Id, user2Id } = req.params

    if (!user1Id) {
      return res.status(404).json({ status: 404, message: 'Unable to add first user' });
    }
    if (!user2Id) {
      return res.status(404).json({ status: 404, message: 'Unable to add second user' });
    }
    // ensure user getting chatroom is the user connected
    if (user1Id != userIdFromToken && user2Id != userIdFromToken) {
      return res.status(401).json({ message: 'Unauthairized action, violation accessing chatroom' })
    }
    if (user1Id == userIdFromToken || user2Id == userIdFromToken) {
      const exists = await ChatRoom.GetChatRommId(user1Id, user2Id);
      res.send(exists);
    }
  } catch (error) {
    console.error('Chatroom not found:', error);
    res.status(500).json({ error: 'Internal server error' });
  }

});

router.get('/chatroom-id/:user1Id/:user2Id', getchatRoomId, verifyToken, async (req, res) => {
  try {
    const userIdFromToken = req.userId
    const { user1Id, user2Id } = req.params;
    // ensure user getting chatroom is the user connected
    if (user1Id != userIdFromToken && user2Id != userIdFromToken) {
      return res.status(401).json({ message: 'Unauthairized action, violation accessing chatroom' })
    }
    if (user1Id == userIdFromToken || user2Id == userIdFromToken) {
      // Query the database to get the chat room ID
      const response = await ChatRoom.GetChatRommId(user1Id, user2Id);
      // Return chat room details
      res.status(200).json(response);
    }
  } catch (error) {
    console.error('Error getting chatroom:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/messages', addUserMessages, verifyToken, async (req, res) => {
  try {
    const userIdFromToken = req.userId
    const { message, user1Id, user2Id, chatroomId } = req.body;
    // ensure user creating message is the user connected
    if (user1Id != userIdFromToken && user2Id != userIdFromToken) {
      return res.status(401).json({ message: 'Unauthairized action, violation creating message in another user space' })
    }
    if (user1Id == userIdFromToken || user2Id == userIdFromToken) {
      // Await the result of the dbQuery function
      const messages = await ChatRoom.insertMessages(message, user1Id, user2Id, chatroomId);
      res.send('Message created succcessfully');
    }
  } catch (error) {
    console.error('Chatroom not found:', error);
    res.status(500).json({ error: 'Internal server error' });
  }

});



export default router;