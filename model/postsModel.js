import { dbQuery } from "../db/db.js";

class Posts{
    static async insertUserDataIntoPost(postContent, groupId, userId){
        const [rows] = await dbQuery('INSERT INTO posts (post_content, group_id, user_id) VALUES (?, ?, ?)', [postContent, groupId, userId]);
        return rows;
    }
    static async selectAllPostWithUser(groupId){
        const [rows] = await dbQuery('SELECT * FROM  posts JOIN  users ON posts.user_id = users.user_id WHERE group_id = ?', [groupId]);
        return rows;
    }
}

export default Posts;