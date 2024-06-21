import 'dotenv/config';
import mysql from 'mysql2/promise';

class DB {
  // Private variable, this can only be accessed inside the class
  #pool;

  constructor(connectionOptionsArg) {
    this.#pool = mysql.createPool(connectionOptionsArg);
  }

  async connect() {
    return this.#pool.getConnection();
  }

  disconnect(connection) {
    connection.release();
  }

  query(sql, value) {
    return this.#pool.query(sql, value);
  }
}

// instanciation
const db = new DB({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
});

export const dbQuery = async (sql, value) => {
  try {
    const connection = await db.connect();
    const result = await db.query(sql, value);
    db.disconnect(connection);
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}
