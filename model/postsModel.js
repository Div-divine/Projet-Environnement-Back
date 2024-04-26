import { dbQuery } from "../db/db.js";

class Posts{
    static async insertUserDataIntoPost(postContent, groupId, userId){
        const [rows] = await dbQuery('INSERT INTO posts (post_content, group_id, user_id) VALUES (?, ?, ?)', [postContent, groupId, userId]);
        return rows;
    }
}

export default Posts;