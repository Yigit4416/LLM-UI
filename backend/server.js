import axios from "axios";
import express, { response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { getUser, getUserByEmail, createUser, deleteUser } from "./auth.js";
import { chat, chatDB } from "./chat.js";

const app = express();
const port = 8080;

app.use(express.json());
app.use(cors());
app.use(cookieParser());

const SESSIONS = new Map();

app.post("/api", async (req, res) => {
    console.log(req.body);

    axios.post('http://localhost:11434/api/generate', {
        model: 'llama3',
        prompt: req.body.prompt,
    })
    .then((response) => {
        const rawData = response.data;
        const lines = rawData.trim().split('\n');
        const responses = lines.map(line => JSON.parse(line).response);
        const completeResponse = responses.join('');
        
        res.send(completeResponse);
    })
    .catch((error) => {
        console.error(error.message);
        res.status(500).send("Error in fetching data");
    });
});

app.post("/login", async (req, res) => {
    getUser(req.body.email, req.body.password)
        .then((result) => {
            if (result) {
                const sessionId = crypto.randomUUID();
                SESSIONS.set(sessionId, req.body.email);
                res
                .cookie("sessionId", sessionId, {
                    httpOnly: true, // client cannot access the cookie with js
                    secure: false, // because we are not using https
                    sameSite: "none",
                })
                .send("Login successful");
                console.log(SESSIONS);
            }
            else {
                console.log(result);
                console.log(req.body);
                res.status(401).send("Invalid credentials");
            }
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send("Error in fetching data");
        });
});

app.post("/register", async (req, res) => {
    createUser(req.body.username, req.body.password, req.body.email)
        .then((result) => {
            res.status(201).send({ message: "User registered successfully", username: req.body.username, email: req.body.email, id: result.insertId
            });
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send("Error in fetching data");
        });
});

app.delete("/delete/:id", async (req, res) => {
    const user = SESSIONS.get(req.cookies.sessionId);
    let userId = await getUserByEmail(user);
    userId = userId.id;
    if (userId !== parseInt(req.params.id)) {
        return res.status(401).send("Unauthorized");
    } else {
        deleteUser(req.params.id)
            .then((result) => {
                if (result.affectedRows) {
                    res.send("User deleted successfully");
                }
                else {
                    res.status(404).send("User not found");
                }
            })
            .catch((error) => {
                console.error(error);
                res.status(500).send("Error in fetching data");
            });
    }
});

// On frontend dont forget to get the chatID from the frontend and send it to the backend. 
// It is in query object and name is insertId.
app.post("/newmessage", async (req, res) => {
    const user = SESSIONS.get(req.cookies.sessionId);
    let userAuth = await getUserByEmail(user);
    if (userAuth === null) {
        return res.status(401).send("Unauthorized");
    } else {
        const newResponse = await chat(userAuth.id, req.body.prompt);
        if (newResponse) {
            return res.status(201).send(newResponse);
        } else {
            return res.status(500).send("Error in processing request");
        }
    }
});

app.post("/savemessage", async (req, res) => {
    const user = SESSIONS.get(req.cookies.sessionId);
    let userAuth = await getUserByEmail(user);
    if (userAuth === null) {
        return res.status(401).send("Unauthorized");
    } else {
        const newResponse = await chatDB(req.body.chatID, userAuth.id, req.body.messageContent, req.body.mode);
        if (newResponse) {
            return res.status(201).send(newResponse);
        } else {
            return res.status(500).send("Error in processing request");
        }
    }
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Backend is accessible on 0.0.0.0:${port}`);
});