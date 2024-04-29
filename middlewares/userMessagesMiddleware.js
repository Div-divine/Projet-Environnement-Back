import ChatRoom from "../model/chatRommsModel.js";

async function addUserMessages(req, res, next) {
    const { message, user1Id, user2Id, chatroomId } = req.body;
    try {
        if(!message.length > 0 ){
            return res.json({ status: 404, message: 'No message to send' });
        }
        if (!user1Id) {
            return res.status(404).json({ status: 404, message: 'Unable to add first user' });
        }
        if (!user2Id) {
            return res.status(404).json({ status: 404, message: 'Unable to add second user' });
        }
        if(!chatroomId){
            return res.status(404).json({ status: 404, message: 'No chatroom found' });
        }
        if (!user1Id && !user2Id) {
            return res.status(404).json({ status: 404, message: 'Can\'t create chatroom' });
        }
        // Await the result of the dbQuery function
        const messages = await ChatRoom.insertMessages(message, user1Id, user2Id, chatroomId);
        next();
    } catch (error) {
        // Handle error
        console.error('Error creating chatroom:', error);
        return res.status(500).json({ status: 500, message: 'Internal server error' });
    }
}

export default addUserMessages;