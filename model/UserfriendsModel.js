import { dbQuery } from "../db/db.js";

class Friends{
    static async createFriends(user1Id, user2Id, status = true){
         const [rows] = await dbQuery('INSERT INTO friendships(user1_id, user2_id, friendship_status) VALUES (?, ?, ?)',[user1Id, user2Id, status]);
         return rows;
    }
}

export default Friends;