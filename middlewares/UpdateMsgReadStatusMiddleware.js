import ChatRoom from "../model/chatRommsModel.js";

function updateMsgStatus(req, res, next) {
    try {
        const { msgId, chatroomId } = req.body;
        const updateMsg = ChatRoom.updateMsgReadStatusById(msgId, chatroomId);
        if (!msgId) {
            return res.status(404).json({ message: 'Message not found' });
        }
        if (!chatroomId) {
            return res.status(404).json({ message: 'Unable to locate chat room' });
        }
        next();
    } catch (error) {
        // Handle error
        console.error('Error Finding chat:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export default updateMsgStatus;