import { dbQuery } from "../db/db.js";

class Posts{
    static async insertUserDataIntoPost(postContent, groupId, userId, incognito = false){
        const [rows] = await dbQuery('INSERT INTO posts (post_content, group_id, user_id, incognito) VALUES (?, ?, ?, ?)', [postContent, groupId, userId, incognito]);
        return rows;
    }
    static async selectAllPostWithUser(groupId){
        const [rows] = await dbQuery('SELECT * FROM  posts JOIN  users ON posts.user_id = users.user_id WHERE group_id = ?', [groupId]);
        return rows;
    }
    static async insertUserDataIntoPostIncognito(postContent, groupId, userId, incognito = true){
        const [rows] = await dbQuery('INSERT INTO posts (post_content, group_id, user_id, incognito) VALUES (?, ?, ?, ?)', [postContent, groupId, userId, incognito]);
        return rows;
    }
    static async selectAllPostComments(postId){
        const [rows] = await dbQuery('SELECT * FROM  comments JOIN  users ON comments.user_id = users.user_id WHERE post_id = ?', [postId]);
        return rows;
    }
    static  async deletePosts(postId){
        const [rows] = await dbQuery('DELETE FROM posts WHERE post_id = ?',[postId]);
        return rows;
    }
    
}

export default Posts;