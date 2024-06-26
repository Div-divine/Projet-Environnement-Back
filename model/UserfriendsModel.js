import { dbQuery } from "../db/db.js";

class Friends {
    static async createFriends(user1Id, user2Id, status = true) {
        const [rows] = await dbQuery('INSERT INTO friendships(user1_id, user2_id, friendship_status) VALUES (?, ?, ?)', [user1Id, user2Id, status]);
        return rows;
    }
    static async selectFriendsPair(user1Id, user2Id) {
        const [rows] = await dbQuery('SELECT * FROM friendships WHERE user1_id= ? AND user2_id = ? OR user1_id = ? AND user2_id = ? ', [user1Id, user2Id, user2Id, user1Id])
        return rows;
    }

    static async getAllUsersFriends(userId) {
        const [rows] = await dbQuery('SELECT user_id FROM friendships f JOIN users u ON u.user_id = CASE WHEN f.user1_id = ? THEN f.user2_id ELSE f.user1_id END WHERE f.user1_id = ? OR f.user2_id = ?', [userId, userId, userId]);
        return rows;
    }
    static async getAllUsersFriendsData(userId) {
        const [rows] = await dbQuery(`SELECT 
        u1.user_id, u1.user_name AS friend_id, u1.user_img AS friend_img
    FROM 
        friendships f
    JOIN 
        users u1 ON f.user1_id = u1.user_id
    WHERE 
        f.user2_id = ?
    UNION
    SELECT 
    u2.user_id, u2.user_name AS friend_id, u2.user_img AS friend_img
    FROM 
        friendships f
    JOIN 
        users u2 ON f.user2_id = u2.user_id
    WHERE 
        f.user1_id = ? `, [userId, userId]);
        return rows;
    }

    static async deleteUsersFromFriends(user1Id, user2Id) {
        const [rows] = await dbQuery('DELETE FROM friendships WHERE user1_id = ? AND user2_id = ? OR  user1_id = ? AND user2_id = ?', [user1Id, user2Id, user2Id, user1Id]);
        return rows;
    }
}

export default Friends;