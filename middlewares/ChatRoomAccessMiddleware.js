import ChatRoom from "../model/chatRommsModel.js";

async function createChatroom(req, res, next) {
    try {
        const { user1Id, user2Id } = req.body;

        // Check if a chatroom already exists for the given pair of users
        const existingChatroom = await ChatRoom.GetChatRommId(user1Id, user2Id);
        if (existingChatroom.length > 0) {
            return res.json({message: 'Chatroom already exists' });
        }

        // Create a new chatroom
        const chatroom = await ChatRoom.createChatRoom(user1Id, user2Id);
        res.status(201).json({ status: 201, message: 'Chatroom created successfully', chatroom });
        next();
    } catch (error) {
        console.error('Error creating chatroom:', error);
        return res.status(500).json({ status: 500, message: 'Internal server error' });
    }
}


export default createChatroom;