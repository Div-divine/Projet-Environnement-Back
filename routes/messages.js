import { Router } from "express";
import verifyToken from "../middlewares/webtokenMiddleware.js";
import ChatRoom from "../model/chatRommsModel.js";
import getUsersMsg from '../middlewares/GetAllMsgMiddleware.js';
import updateMsgStatus from "../middlewares/UpdateMsgReadStatusMiddleware.js";

const router = Router();

router.get('/:senderId/:receiverId', getUsersMsg, verifyToken, async (req, res) => {
  try {
    // Access users ID from request object
    const { senderId, receiverId } = req.params;

    const messages = await ChatRoom.getAllMsgs(senderId, receiverId);
    // Check if there is no message exists
    if (!messages.length > 0) {
      return res.status(404).json({ status: 404, message: 'No message found' });
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
    res.json({ message: 'Message satus successfully updated'})
});

export default router;