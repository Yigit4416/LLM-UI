import mysql2 from 'mysql2';
import axios from "axios";

const pool = mysql2.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
}).promise();

export async function chat(userID, prompt) {
    try {
        const response = await axios.post("http://localhost:8080/api", {
            prompt: `Now what you need to do is create a max 50 caracter header out of user input don't forget only 50 caracter just like 3 caracter word 'car'. You don't have to wirte anything i just want you to write max 50 caracter header. And don't write as .md format i just want plain text. DO NOT WRITE SOMETHING DIFFERENT JUST GIVE ME HEADER.Here is your input: ${prompt}`,
        });
        // Perform the database insertion asynchronously
        pool.query('INSERT INTO chat_headers (userID, header) VALUES (?, ?)', [userID, response.data])
            .catch(error => console.error(error.message));
        return response.data;
    } catch (error) {
        console.error(error.message);
        return null;
    }
}

export async function chatDB(chatID, userID, messageContent){
    pool.query()
}

//console.log(chat(11, "Hello, how are you?"));