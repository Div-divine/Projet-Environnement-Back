import { Router } from "express";
import verifyToken from "../middlewares/webtokenMiddleware.js";
import ChatRoom from "../model/chatRommsModel.js";
import getUsersMsg from '../middlewares/GetAllMsgMiddleware.js';
import updateMsgStatus from "../middlewares/UpdateMsgReadStatusMiddleware.js";
import checkReceiverAndMsgState from "../middlewares/CheckReceiverForUnreadMsgMiddleware.js";

const router = Router();

router.get('/unreadMsg/:id', checkReceiverAndMsgState, verifyToken, async (req, res) => {
  try {
    // Access receiver ID from request params
    const receiverId = req.params.id;

    const unreadMsg = await ChatRoom.getAllFromUnreadMsgs(receiverId);
    // Check if there is a message not yet read
    if (!unreadMsg.length > 0) {
      return res.send('No unread message found');
    }
    res.send(unreadMsg);
  } catch (error) {
    // Handle any errors
    console.error('Error fetching unread messages :', error)
    res.status(500).json({ status: 500, message: 'Internal server error' });
  }
});


router.get('/:senderId/:receiverId', getUsersMsg, verifyToken, async (req, res) => {
  try {
    // Access users ID from request object
    const { senderId, receiverId } = req.params;

    const messages = await ChatRoom.getAllMsgs(senderId, receiverId);
    // Check if there is no message exists
    if (!messages.length > 0) {
      return res.send('No message found');
    }
    // Verifier si le message requêté fait parti d'un chatroom
    if(!messages.every(message => message.hasOwnProperty('chatroom_id'))){
      return res.status(404).json({ status: 404, message: 'No chatroom found' });
    }

    res.send(messages);
  } catch (error) {
    // Handle any errors
    console.error('Error fetching user data:', error)
    res.status(500).json({ status: 500, message: 'Internal server error' });
  }
});

router.post('/update-msg-status', updateMsgStatus, verifyToken, (req, res) => {
    res.json({ message: 'Message status successfully updated'})
});




export default router;