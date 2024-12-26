# LLM UI
This is a user-friendly interface similar to ChatGPT, designed to work with the llama3.2:3b model. The project aims to provide an interactive platform for exploring the capabilities of language models. It can be customized for various use cases, such as conversational AI, educational tools, or integrating AI-powered features into applications.
If you want you can change server side so you can use different models.

# Requirement
For this project, you need to install 'ollama', which can be downloaded from its [official website](https://ollama.com/download). After installing 'ollama', use it to download the llama3.2:3b model by running the appropriate commands as detailed in the 'ollama' documentation.

# Running project
- Make sure that the ollama service is running, as it acts as the backend server responsible for handling and serving the llama3.2:3b model's requests. You can verify its status with this bash code:
```bash
sudo systemctl status ollama
```
- After this, you need to install dependencies for the backend and frontend separately, as each has unique requirements and configurations. The backend handles server-side logic and model interactions, while the frontend manages the user interface and client-side functionality. Install them with:
```bash
# for backend
cd backend
npm install
```

```bash
# for frontend
cd vite-project
npm install
```

- After all of these you can run these
```bash
cd backend
nodemon server.js
```

```bash
cd vite-project
npm run dev
```
- For running this site on a local network, ensure that port 5173 is open. You can check if the port is open by running a command like `sudo ufw status` or using a network scanning tool. Please note that opening ports can pose security risks, so only open the port temporarily and ensure your network is secured.
```bash
sudo ufw allow 5173
```

```bash
cd vite-project
npm run dev -- --host
```