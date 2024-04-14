import 'dotenv/config';
import mysql from 'mysql2/promise';

class DB {
  // Private variable, this can only be accessed inside the class
  #connectionOptions;
  // private
  #connection;

  constructor(connectionOptionsArg) {
    this.#connectionOptions = connectionOptionsArg;
  }

  async connect() {
    this.#connection = await mysql.createConnection(this.#connectionOptions);
    return this;
  }

  disconnect() {
    this.#connection.destroy();
  }

  query(sql, value) {
    return this.#connection.query(sql, value);
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
  await db.connect();
  const result = await db.query(sql, value);
  db.disconnect();
  return result;
}
