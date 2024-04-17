import { dbQuery } from "../db/db.js";

class UsersGroups{
    static async addUserGroups(userId, groupId){
        const [rows] = await dbQuery('INSERT INTO users_actionsgroups(user_id, group_id) VALUES (?, ?)', [userId, groupId])
    }
    static async CheckUserAlreadyExistsInAGroup(userId, groupId){
        const [rows] = await dbQuery('SELECT * FROM users_actionsgroups WHERE user_id = ? AND group_id = ?', [userId, groupId])
        return rows[0]
    }
}

export default UsersGroups;