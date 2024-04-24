import ChatRoom from "../model/chatRommsModel.js";

async function createChatroom(req, res, next) {
    try {
        const { user1Id, user2Id } = req.body;
        const exists = await ChatRoom.GetChatRommId(user1Id, user2Id)

        if (!user1Id) {
            return res.status(404).json({ status: 404, message: 'Unable to add first user' });
        }
        if (!user2Id) {
            return res.status(404).json({ status: 404, message: 'Unable to add second user' });
        }
        if (!user1Id && !user2Id) {
            return res.status(404).json({ status: 404, message: 'Can\'t create chatroom' });
        }

        if (exists) {
            return res.status(404).json({ status: 404, message: 'Chatroom already created' });
        }

        // Await the result of the dbQuery function
        const chatroom = await ChatRoom.createChatRoom(user1Id, user2Id);

        next();
    } catch (error) {
        // Handle error
        console.error('Error creating chatroom:', error);
        return res.status(500).json({ status: 500, message: 'Internal server error' });
    }
}

export default createChatroom;