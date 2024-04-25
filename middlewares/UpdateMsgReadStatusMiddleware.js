import ChatRoom from "../model/chatRommsModel.js";

async function updateMsgStatus(req, res, next) {
    try {
        const { msgId, chatroomId } = req.body;
        if (!msgId) {
            return res.status(404).json({ message: 'Message not found' });
        }
        if (!chatroomId) {
            return res.status(404).json({ message: 'Unable to locate chat room' });
        }
        // Await the database operation
        await ChatRoom.updateMsgReadStatusById(msgId, chatroomId);
        next();
    } catch (error) {
        // Handle error
        console.error('Error updating message status:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}


export default updateMsgStatus;