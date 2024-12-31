import mysql2 from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql2.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
}).promise();

export async function getUser(username) {
    const [rows] = await pool.query('SELECT * FROM authentication WHERE name = ?', [username]);
    return rows[0];
}

export async function createUser(username, password, email) {
    try {
        const [result] = await pool.query('INSERT INTO authentication (name, password, email) VALUES (?, ?, ?)', [username, password, email]);
        return result;
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            console.error('Duplicate entry for email:', email);
            return 'Duplicate entry for email';
        } else {
            console.error(error.message);
            return 'Error in creating user';
        }
    }
}

export async function deleteUser(id) {
    const [result] = await pool.query('DELETE FROM authentication WHERE id = ?', [id]);
    return result;
}

console.log(await deleteUser(1));