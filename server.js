const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

const SMARTX_SUMMARY = `
SmartX P2P es una plataforma descentralizada de intercambio de criptomonedas.
Usa escrow on-chain, KYC obligatorio, y cuenta con un token llamado $STX que ofrece beneficios como descuentos, staking y recompensas para usuarios activos. 
Tiene soporte multilingüe, XPAY gratuito, reputación de usuarios, PIN de seguridad, autenticación biométrica y roadmap de evolución hasta Q4 2025.
`;

app.post("/chat", async (req, res) => {
  const { message } = req.body;

  try {
    const response = await axios.post(
      "https://api.deepseek.com/v1/chat/completions",
      {
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: `Responde como Smarty, el asistente oficial de SmartX P2P. Usa el siguiente contexto:\n${SMARTX_SUMMARY}`
          },
          {
            role: "user",
            content: message
          }
        ],
        max_tokens: 400
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${DEEPSEEK_API_KEY}`
        }
      }
    );

    const reply = response?.data?.choices?.[0]?.message?.content;

    if (!reply) {
      return res.status(500).json({ reply: "Smarty no pudo procesar la respuesta correctamente." });
    }

    res.json({ reply });
  } catch (error) {
    console.error("Error con DeepSeek API:", error?.response?.data || error.message);
    res.status(500).json({ reply: "Lo siento, hubo un error con la API de Smarty." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});
