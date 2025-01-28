import mysql2 from 'mysql2';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

dotenv.config();

const pool = mysql2.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
}).promise();

export async function getUser(email, password) {
    try {
        const [rows] = await pool.query('SELECT * FROM authentication WHERE email = ?', [email]);
        const isMatch = bcrypt.compare(password, rows[0].password);
        return isMatch;
    }
    catch (error) {
        return error.sqlMessage;
    }
}

export async function getUserByEmail(email) {
    try {
        const [rows] = await pool.query('SELECT * FROM authentication WHERE email = ?', [email]);
        return rows[0];
    }
    catch (error) {
        return error.sqlMessage;
    }
}

export async function createUser(username, password, email) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    try {
        const [result] = await pool.query('INSERT INTO authentication (name, password, email) VALUES (?, ?, ?)', [username, passwordHash, email]);
        return result;
    }
    catch (error) {
        return error.sqlMessage;
    }
}

export async function deleteUser(id) {
    try{
        const [result] = await pool.query('DELETE FROM authentication WHERE id = ?', [id]);
        return result;
    }
    catch (error) {
        return error.sqlMessage;
    }
}