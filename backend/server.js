import axios from "axios";
import express from "express";
import cors from "cors";

const app = express();
const port = 8080;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.get("/test", (req, res) => {
    res.send("Backend is accessible");
});

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

app.listen(port, '0.0.0.0', () => {
    console.log(`Backend is accessible on 0.0.0.0:${port}`);
});