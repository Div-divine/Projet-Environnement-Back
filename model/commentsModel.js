import { dbQuery } from "../db/db.js";

class Comments{
    static async createPostComments(commentMsg, postId, userId){
        const [rows] = await dbQuery('INSERT INTO comments (comment_msg, post_id, user_id) VALUES (?, ?, ?)',[commentMsg, postId, userId]);
        return rows;
    }
}

export default Comments;