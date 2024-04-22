import ChatRoom from "../model/chatRommsModel.js";

async function createChatroom(req, res, next) {
    const { user1Id, user2Id } = req.body;
    try {
        // Await the result of the dbQuery function
        const chatroom = await ChatRoom.createChatRoom(user1Id, user2Id);
        if (!user1Id) {
            return res.status(404).json({ status: 404, message: 'Unable to add first user' });
        }
        if (!user2Id) {
            return res.status(404).json({ status: 404, message: 'Unable to add second user' });
        }
        if (!user1Id && !user2Id) {
            return res.status(404).json({ status: 404, message: 'Can\'t create chatroom' });
        }
        console.log('chatroom created successfully');
        res.send('chatroom created successfully');
        next();
    } catch (error) {
        // Handle error
        console.error('Error creating chatroom:', error);
        return res.status(500).json({ status: 500, message: 'Internal server error' });
    }
}

export default createChatroom;