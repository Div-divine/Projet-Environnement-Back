import { dbQuery } from "../db/db.js";

class Posts{
    static async insertUserDataIntoPost(postContent, groupId, userId, incognito = false, postUserQuit = false){
        const [rows] = await dbQuery('INSERT INTO posts (post_content, group_id, user_id, incognito, post_user_quit) VALUES (?, ?, ?, ?, ?)', [postContent, groupId, userId, incognito, postUserQuit]);
        return rows;
    }
    static async getPost(postId){
        const [rows] = await dbQuery('SELECT post_created FROM posts WHERE post_id = ? ', [postId]);
        return rows;
    }
    static async selectAllPostWithUser(groupId){
        const [rows] = await dbQuery('SELECT * FROM  posts JOIN  users ON posts.user_id = users.user_id WHERE group_id = ? ORDER BY post_created DESC', [groupId]);
        return rows;
    }
    static async insertUserDataIntoPostIncognito(postContent, groupId, userId, incognito = true, postUserQuit = false){
        const [rows] = await dbQuery('INSERT INTO posts (post_content, group_id, user_id, incognito, post_user_quit) VALUES (?, ?, ?, ?, ?)', [postContent, groupId, userId, incognito, postUserQuit]);
        return rows;
    }
    static async selectAllPostComments(postId){
        const [rows] = await dbQuery('SELECT * FROM  comments JOIN  users ON comments.user_id = users.user_id WHERE post_id = ?', [postId]);
        return rows;
    }
    static  async deletePosts(postId, userId){
        const [rows] = await dbQuery('DELETE FROM posts WHERE post_id = ? AND user_id = ?',[postId, userId]);
        return rows;
    }
    static async updateUserPost(postId, postContent, userId){
        const [rows] = await dbQuery('UPDATE posts SET post_content = ? WHERE post_id = ? AND user_id = ?',[postContent, postId, userId]);
        return rows;
    }
    static async updatePostStatusOnceUserQuitsGroup(postUserQuit , groupId, userId){
        const [rows] = await dbQuery('UPDATE posts SET post_user_quit = ? WHERE posts.group_id = ? AND posts.user_id = ? ', [postUserQuit, groupId, userId]);
        return rows;
    }
    
}

export default Posts;