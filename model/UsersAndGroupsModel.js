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
        const [rows] = await dbQuery("SELECT COALESCE(users_actionsgroups.user_id, users.user_id) AS user_id, users_actionsgroups.group_id AS user_group_id, users.*,  actionsgroups.* FROM  users LEFT JOIN  users_actionsgroups ON users.user_id = users_actionsgroups.user_id LEFT JOIN  actionsgroups ON users_actionsgroups.group_id = actionsgroups.group_id WHERE  users.user_id = ?",[userId]);
        return rows;
    }
    static async SelectAllUsers(userId){
        const [rows] = await dbQuery('SELECT * FROM users WHERE user_id != ?',[userId]);
        return rows;
    }
    static async SelectAllUsersWithGroupsExceptOne(userId){
        const [rows] = await dbQuery("SELECT * FROM actionsgroups JOIN users_actionsgroups ON actionsgroups.group_id = users_actionsgroups.group_id JOIN users ON users_actionsgroups.user_id = users.user_id WHERE users.user_id != ?",[userId]);
        return rows;
    }
    static async selectAllUsersOfAgroup(groupId){
        const [rows] = await dbQuery('SELECT users.user_name, users.user_img FROM actionsgroups JOIN users_actionsgroups ON actionsgroups.group_id = users_actionsgroups.group_id JOIN users ON users_actionsgroups.user_id = users.user_id WHERE actionsgroups.group_id = ?',[groupId]);
        return rows;
    }
    static async checkUserBelongsToAGroup(userId, groupId){
        const [rows] = await dbQuery('SELECT user_id FROM users_actionsgroups WHERE user_id = ? AND group_id = ?',[userId, groupId]);
        return rows[0];
    }
}

export default UsersGroups;