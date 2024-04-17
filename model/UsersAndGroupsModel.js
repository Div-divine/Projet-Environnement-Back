import { dbQuery } from "../db/db.js";

class UsersGroups {
    static async addUserGroups(userId, groupId) {
        const [rows] = await dbQuery('INSERT INTO users_actionsgroups(user_id, group_id) VALUES (?, ?)', [userId, groupId])
    }
    static async CheckUserAlreadyExistsInAGroup(userId, groupId) {
        const [rows] = await dbQuery('SELECT COUNT(*) AS count FROM users_actionsgroups WHERE user_id = ? AND group_id = ?', [userId, groupId])
        console.log(rows[0])
        return rows[0]
    }
    static async selectUserWithGroups(userId) {
        const [rows] = await dbQuery("SELECT group_name FROM actionsgroups JOIN users_actionsgroups ON actionsgroups.group_id = users_actionsgroups.group_id JOIN users ON users_actionsgroups.user_id = users.user_id WHERE users.user_id = ?",[userId]);
        return rows;
    }
}

export default UsersGroups;