import axios from "axios";
import express, { response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { getUser, getUserByEmail, createUser, deleteUser } from "./auth.js";
import { chat, chatDB, chatHistory, oldChat } from "./chat.js";

const app = express();
const port = 8080;

app.use(express.json());
app.use(
    cors({
        origin: "http://localhost:5173", // Change this to your frontend URL
        credentials: true,
    })
);
app.use(cookieParser());

const SESSIONS = new Map();

app.post("/api", async (req, res) => {
    // For ollama
    axios.post('http://localhost:11434/api/generate', {
        model: 'llama3',
        prompt: req.body.prompt,
        "stream": false // Take care of this later
    })
    .then((response) => {
        res.send(response.data.response);
    })
    .catch((error) => {
        console.error("Error:", error.message);
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
                    httpOnly: true, // client cannot access the cookie with js if this becomes true
                    secure: false, // because we are not using https
                    sameSite: "lax",
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
    console.log(req.cookies)
    const user = SESSIONS.get(req.cookies.sessionId);
    let userAuth = await getUserByEmail(user);
    if (userAuth === undefined) {
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
    try {
        const user = SESSIONS.get(req.cookies.sessionId);
        if (!user) {
            return res.status(401).send("No session found");
        }

        const userAuth = await getUserByEmail(user);

        if (!userAuth) {
            return res.status(401).send("User not found");
        }

        if (!userAuth.id) {
            return res.status(401).send("Invalid user data - missing ID");
        }

        // Validate required request body parameters
        if (!req.body.chatIndex || !req.body.messageContent || !req.body.mode) {
            console.log({
                chatIndex: req.body.chatIndex,
                messageContent: req.body.messageContent.props.text,
                mode: req.body.mode
            })
            return res.status(400).send("Missing required parameters");
        }

        const newResponse = await chatDB(
            req.body.chatIndex, 
            parseInt(userAuth.id), 
            req.body.messageContent.props.text, 
            req.body.mode
        );

        if (!newResponse) {
            return res.status(500).send("Error in processing request");
        }

        return res.status(201).send(newResponse);

    } catch (error) {
        console.error("Error in /savemessage:", error);
        return res.status(500).send("Internal server error");
    }
});

app.get("/chat-history", async (req, res) => {
    const user = SESSIONS.get(req.cookies.sessionId);
    let userAuth = await getUserByEmail(user);
    if (userAuth === null || userAuth === undefined) {
        return res.status(401).send("Unauthorized");
    } else {
        const history = await chatHistory(parseInt(userAuth.id));
        if (history) {
            return res.status(200).send(history);
        } else {
            return res.status(500).send("Error in processing request");
        }
    }
});

app.get("/chat-history/:id", async (req, res) => {
    const user = SESSIONS.get(req.cookies.sessionId);
    let userAuth = await getUserByEmail(user);
    if (userAuth === null || userAuth === undefined) {
        return res.status(401).send("Unauthorized");
    } else {
        const history = await oldChat(parseInt(req.params.id));
        if (history) {
            return res.status(200).send(history);
        } else {
            return res.status(500).send("Error in processing request");
        }
    }
});

app.get("/is-logged-in", async (req, res) => {
    const user = SESSIONS.get(req.cookies.sessionId);
    if (user) {
        res.send({ loggedIn: true });
    } else {
        res.send({ loggedIn: false });
    }
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Backend is accessible on 0.0.0.0:${port}`);
});