import { dbQuery } from "../db/db.js";

class UsersGroups{
    static async addUserGroups(userId, groupId){
        const [rows] = await dbQuery('INSERT INTO users_actionsgroups(user_id, group_id) VALUES (?, ?)', [userId, groupId])
    }
}

export default UsersGroups;