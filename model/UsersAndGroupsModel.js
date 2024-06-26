import { dbQuery } from "../db/db.js";

class UsersGroups {
    static async addUserGroups(userId, groupId, quitGroup = false) {
        const [rows] = await dbQuery('INSERT INTO users_actionsgroups(user_id, group_id, quit_group) VALUES (?, ?, ?)', [userId, groupId, quitGroup])
        return rows;
    }
    static async CheckUserAlreadyExistsInAGroup(userId, groupId) {
        const [rows] = await dbQuery('SELECT COUNT(*) AS count, quit_group AS quit FROM users_actionsgroups WHERE user_id = ? AND group_id = ?', [userId, groupId])
        console.log(rows[0])
        return rows[0]
    }
    static async selectUserWithGroups(userId) {
        const [rows] = await dbQuery("SELECT COALESCE(users_actionsgroups.user_id, users.user_id) AS user_id, users_actionsgroups.group_id AS user_group_id, users_actionsgroups.quit_group AS user_quit_group, users.*,  actionsgroups.* FROM  users LEFT JOIN  users_actionsgroups ON users.user_id = users_actionsgroups.user_id LEFT JOIN  actionsgroups ON users_actionsgroups.group_id = actionsgroups.group_id WHERE  users.user_id = ?", [userId]);
        return rows;
    }
    static async SelectAllUsers(userId) {
        const [rows] = await dbQuery('SELECT * FROM users WHERE user_id != ?', [userId]);
        return rows;
    }
    static async SelectAllUsersWithGroupsExceptOne(userId) {
        const [rows] = await dbQuery("SELECT * FROM actionsgroups JOIN users_actionsgroups ON actionsgroups.group_id = users_actionsgroups.group_id JOIN users ON users_actionsgroups.user_id = users.user_id WHERE users.user_id != ?", [userId]);
        return rows;
    }
    static async selectAllUsersOfAgroup(groupId) {
        const [rows] = await dbQuery('SELECT users.user_name, users.user_img, users.show_user_image FROM actionsgroups JOIN users_actionsgroups ON actionsgroups.group_id = users_actionsgroups.group_id JOIN users ON users_actionsgroups.user_id = users.user_id WHERE actionsgroups.group_id = ?', [groupId]);
        return rows;
    }
    static async checkUserBelongsToAGroup(userId, groupId) {
        const [rows] = await dbQuery('SELECT user_id FROM users_actionsgroups WHERE user_id = ? AND group_id = ?', [userId, groupId]);
        return rows[0];
    }
    static async updateGroupStatusOnceUserQuitsGroup(userQuitsGroup, userId, groupId) {
        const [rows] = await dbQuery('UPDATE users_actionsgroups SET quit_group = ? WHERE user_id = ? AND group_id = ? ', [userQuitsGroup, userId, groupId]);
        return rows;
    }
    static async selectUserQuitGroupState(userId, groupId) {
        const [rows] = await dbQuery('SELECT quit_group FROM users_actionsgroups WHERE user_id = ? AND group_id = ?', [userId, groupId]);
        return rows[0];
    }
}

export default UsersGroups;