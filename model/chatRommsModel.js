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
        return rows;
    }
    static async insertMessages(message, user1Id, user2Id, chatroomId, msgRead = false){
        const [rows] = await dbQuery('INSERT INTO messages(msg_content, sender_id, receiver_id, chatroom_id, msg_read) VALUES(?, ?, ?, ?, ?)',[message, user1Id, user2Id, chatroomId, msgRead]);
        return rows;
    }
    static async getAllMsgs(user1Id, user2Id){
      const [rows] = await dbQuery('SELECT * FROM messages WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?) ORDER BY msg_created',[user1Id, user2Id, user2Id, user1Id]);
      return rows;
    }
    static async updateMsgReadStatusById(msgId, chatroomId, received = true){
        const [rows] = await dbQuery('UPDATE messages SET msg_read = ? WHERE msg_id IN (?) AND chatroom_id = ? ', [received, msgId, chatroomId]);
        return rows;
    }
    static async getAllFromUnreadMsgs(receiverId, msgState = false){
        const [rows] = await dbQuery('SELECT sender.*, receiver.*, messages.* FROM messages JOIN users AS sender ON sender.user_id = messages.sender_id JOIN users AS receiver ON receiver.user_id = messages.receiver_id WHERE messages.receiver_id = ? AND messages.msg_read = ? ;',[receiverId, msgState]);
        return rows;
    }
}

export default ChatRoom;