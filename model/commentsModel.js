import { dbQuery } from "../db/db.js";

class Comments{
    static async createPostComments(commentMsg, postId, userId, maskCommentUser = false){
        const [rows] = await dbQuery('INSERT INTO comments (comment_msg, post_id, user_id, mask_comment_user) VALUES (?, ?, ?, ?)',[commentMsg, postId, userId, maskCommentUser]);
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
    static async updateUserComment(commentId, commentUpdate, userId){
        const [rows] = await dbQuery('UPDATE comments SET comment_msg = ? WHERE comment_id = ? AND user_id= ?',[commentUpdate, commentId, userId]);
        return rows;
    }
    static async updateCommentStatusOnceUserQuitsGroup(maskCommentInGroup, userId, groupId){
        const [rows] = await dbQuery('UPDATE comments c JOIN users u ON c.user_id = u.user_id JOIN users_actionsgroups uag ON u.user_id = uag.user_id SET c.mask_comment_user = ? WHERE uag.user_id = ? AND uag.group_id = ?', [maskCommentInGroup, userId, groupId]);
        return rows;
    }
}

export default Comments;