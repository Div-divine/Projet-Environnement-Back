import { dbQuery } from "../db/db.js";

class Groups{
    static async selectAllFromGroups(){
        const [rows] = await dbQuery('SELECT * FROM actionsgroups');
        return rows;
    }
    static async SelectOneFromGroups(groupId){
        const [rows] = await dbQuery('SELECT * FROM actionsgroups WHERE group_id = ? ', [groupId]);
        return rows[0];
    }
}

export default Groups;