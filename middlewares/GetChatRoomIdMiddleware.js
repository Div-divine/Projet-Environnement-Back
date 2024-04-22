import ChatRoom from "../model/chatRommsModel.js";

async function getchatRoomId(req, res) {
    // Extract users ID from request parameters
    const { user1Id, user2Id } = req.params;

    try {
        // Query the database to get the chat room ID
        const response = await ChatRoom.GetChatRommId(user1Id, user2Id);
         
        // Check if user1Id or user2Id are missing
        if (!user1Id || !user2Id) {
            return res.status(404).json({ message: 'User IDs are required' });
        }

        // Check if chat room exists
        if (!response) {
            return res.status(404).json({ message: 'Chat room not found' });
        }

        // Return chat room details
        res.status(200).json(response);
    } catch (error) {
        // Handle error
        console.error('Error fetching chat room ID:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export default getchatRoomId;
