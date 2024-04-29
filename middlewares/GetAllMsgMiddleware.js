import ChatRoom from "../model/chatRommsModel.js";

async function getUsersMsg(req, res, next) {

    const { senderId, receiverId } = req.params;
    try {
        if (!senderId) {
            return res.status(404).json({ status: 404, message: 'First user not found' });
        }
        if (!receiverId) {
            return res.status(404).json({ status: 404, message: 'Second user not found' });
        }
        next();
    } catch (error) {
        // Handle error
        console.error('Error fetching user:', error);
        return res.status(500).json({ status: 500, message: 'Internal server error' });
    }
}

export default getUsersMsg;