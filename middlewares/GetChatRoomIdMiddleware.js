import ChatRoom from "../model/chatRommsModel.js";

// Route handler to get a user by ID
async function getchatRoomId(req, res) {
    // Extract users ID from request body
    const {user1Id, user2Id} = req.body

    try {
        // Query the database to get the user by ID
        const response = await ChatRoom.GetChatRommId(user1Id, user2Id);
         
        if(!user1Id){
            return res.status(404).json({ message: 'First User not found' });
        }
        if(!user2Id){
            return res.status(404).json({ message: 'Second User not found' });
        }
        // Check if user exists
        if (!response) {
            return res.status(404).json({ message: 'Users not found' });
        }

        // Return user details
        res.status(200).json(response);
    } catch (error) {
        // Handle error
        console.error('Error fetching user by ID:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export default getchatRoomId;
