const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY; // Variable de entorno

// Ruta raíz para evitar "Cannot GET /"
app.get("/", (req, res) => {
    res.send("Smarty está en línea 🚀. Para interactuar con el chatbot, envía una solicitud POST a /chat.");
});

app.post("/chat", async (req, res) => {
    const { message } = req.body;

    try {
        const response = await axios.post(
            "https://api.deepseek.com/v1/chat/completions",
            {
                model: "deepseek-chat",
                messages: [{ role: "system", content: "Eres Smarty, el asistente de SmartX P2P." }, 
                           { role: "user", content: message }],
                max_tokens: 100
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${DEEPSEEK_API_KEY}`
                }
            }
        );

        res.json({ reply: response.data.choices[0].message.content });
    } catch (error) {
        console.error("Error con DeepSeek API:", error);
        res.status(500).json({ reply: "Lo siento, hubo un error al procesar tu solicitud." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
