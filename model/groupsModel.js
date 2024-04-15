import { dbQuery } from "../db/db.js";

class Groups{
    static async selectAllFromGroups(){
        const [rows] = await dbQuery('SELECT * FROM actionsgroups');
        return rows;
    }
}

export default Groups;