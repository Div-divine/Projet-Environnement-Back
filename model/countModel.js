import { dbQuery } from "../db/db.js";


class Count{
    static async getNbrOfUsers(){
        const [rows] = await dbQuery('SELECT COUNT(*) AS nbr FROM users');
        return rows[0];
    }
}

export default Count;