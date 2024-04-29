import Friends from "../model/UserfriendsModel.js";

async function verifyFriendPair(req, res, next){
   try {
    const { user1Id, user2Id } = req.body
    const friendExists = await Friends.selectFriendsPair(user1Id, user2Id)
    if (friendExists.length > 0) {
        return res.json({ message: 'Friend request already sent' });
    }
    next();
} catch (error) {
    // Handle error
    console.error('Error fetching user:', error);
    return res.status(500).json({ status: 500, message: 'Internal server error' });
}
}

export default verifyFriendPair;