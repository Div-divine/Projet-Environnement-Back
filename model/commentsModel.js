import { dbQuery } from "../db/db.js";

class Comments{
    static async createPostComments(commentMsg, postId, userId){
        const [rows] = await dbQuery('INSERT INTO comments (comment_msg, post_id, user_id) VALUES (?, ?, ?)',[commentMsg, postId, userId]);
        return rows;
    }
    static async deleteComments(postId){
        const [rows] = await dbQuery('DELETE FROM comments WHERE post_id = ?',[postId]);
        return rows;
    }

    static async deleteUserCommentOnly(commentId){
        const [rows] = await dbQuery('DELETE FROM comments WHERE comment_id = ? ',[commentId]);
        return rows;
    }
    static async updateUserComment(commentId, commentUpdate){
        const [rows] = await dbQuery('UPDATE comments SET comment_msg = ? WHERE comment_id = ?',[commentUpdate, commentId]);
        return rows;
    }
}

export default Comments;