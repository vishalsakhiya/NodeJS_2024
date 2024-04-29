import mysql from 'mysql';
import util from 'util';
import dotenv from "dotenv";
dotenv.config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
})

export const query = util.promisify(db.query).bind(db);
export const beginTransaction = util.promisify(db.beginTransaction).bind(db);
export const rollback = util.promisify(db.rollback).bind(db);
export const commit = util.promisify(db.commit).bind(db);

export default db;