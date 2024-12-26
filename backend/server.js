import axios from "axios";
import express from "express";

const app = express();
const port = 8080;

// STOP FROGETING THIS LINE
app.use(express.json());

app.post("/api", async (req, res) => {
    console.log(req.body);

    axios.post('http://localhost:11434/api/generate', {
        model: 'llama3.2',
        prompt: req.body.prompt,
    })
    .then((response) => {
        // Extract and process the response data
        const rawData = response.data; // Assuming rawData is in string format
        const lines = rawData.trim().split('\n');
        const responses = lines.map(line => JSON.parse(line).response);
        const completeResponse = responses.join('');
        
        // Send back the processed response
        res.send(completeResponse);
    })
    .catch((error) => {
        console.error(error.message);
        res.status(500).send("Error in fetching data");
    });
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});