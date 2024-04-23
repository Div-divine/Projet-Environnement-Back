import { dbQuery } from "../db/db.js";
import { v4 as uuidv4 } from "uuid";

class ChatRoom {
    static async createChatRoom(user1Id, user2Id){
        const chatroomId = uuidv4();  // Generate a uuid fro chatrooms
        const [rows] = await dbQuery('INSERT INTO chatrooms(chatroom_id, user1_id, user2_id) VALUES(?, ?, ?)', [chatroomId, user1Id, user2Id]);
        return rows;
    }
    static async checkUsersExists(user1Id, user2Id){
        const [rows] = await dbQuery('SELECT id FROM chatrooms WHERE (user1_id = ? AND user2_id = ?) OR (user1_id = ? AND user2_id = ?)', [user1Id, user2Id, user2Id, user1Id],);
        return rows[0];
    }
    
    static async GetChatRommId(user1Id, user2Id){
        const [rows] = await dbQuery('SELECT chatroom_id FROM chatrooms WHERE (user1_id = ? AND user2_id = ?) OR (user1_id = ? AND user2_id = ?)', [user1Id, user2Id, user2Id, user1Id],);
        return rows[0];
    }
    static async insertMessages(message, user1Id, user2Id, chatroomId){
        const [rows] = await dbQuery('INSERT INTO messages(msg_content, sender_id, receiver_id, chatroom_id) VALUES(?, ?, ?, ?)',[message, user1Id, user2Id, chatroomId]);
        return rows;
    }
    static async getAllMsgs(user1Id, user2Id){
      const [rows] = await dbQuery('SELECT msg_content, msg_created, sender_id, receiver_id , chatroom_id FROM messages WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)',[user1Id, user2Id, user2Id, user1Id]);
      return rows;
    }
}

export default ChatRoom;