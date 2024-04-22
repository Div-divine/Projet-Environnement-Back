import ChatRoom from "../model/chatRommsModel.js";

function enableOneChatrommPerPair(req, res, next){
    const {user1Id, user2Id} = req.body
    const exists = ChatRoom.checkUsersExists(user1Id, user2Id)
    if(exists.count){
        return res.status(404).json({ status: 404, message: 'Users  pair chatromm already created' });
    }
    next();
}

export default enableOneChatrommPerPair;