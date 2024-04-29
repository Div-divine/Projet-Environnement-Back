import { dbQuery } from "../db/db.js";

class Friends{
    static async createFriends(user1Id, user2Id, status = true){
         const [rows] = await dbQuery('INSERT INTO friendships(user1_id, user2_id, friendship_status) VALUES (?, ?, ?)',[user1Id, user2Id, status]);
         return rows;
    }
    static async selectFriendsPair(user1Id, user2Id){
         const [rows] = await dbQuery('SELECT * FROM friendships WHERE user1_id = ? AND user2_id = ? OR user1_id = ? AND user2_id = ?',[user1Id, user2Id, user2Id, user1Id]);
         return rows;
    }
}

export default Friends;