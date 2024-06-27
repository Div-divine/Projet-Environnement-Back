import { dbQuery } from "../db/db.js";

class Admin{
    static async getRoleByEmail(userEmail) {
        const [row] = await dbQuery('SELECT status_id FROM users WHERE user_email= ?', [userEmail]);
        return row[0];
    }
}

export default Admin;