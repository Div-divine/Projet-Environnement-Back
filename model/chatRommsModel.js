import { dbQuery } from "../db/db.js";
import { v4 as uuidv4 } from "uuid";

class ChatRoom {
    static async createChatRoom(user1Id, user2Id){
        const chatroomId = uuidv4();  // Generate a uuid fro chatrooms
        const [rows] = await dbQuery('INSERT INTO chatrooms(chatroom_id, user1_id, user2_id) VALUES(?, ?, ?)', [chatroomId, user1Id, user2Id]);
        return rows;
    }
}

export default ChatRoom;