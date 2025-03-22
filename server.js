const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

const SMARTX_SUMMARY = `
SmartX P2P es una plataforma descentralizada para comprar y vender criptomonedas usando escrow on-chain. 
Integra XPAY (transferencias internas sin comisiones), wallets automáticas para USDT, USDC y STX, y verificación KYC obligatoria. 
El token $STX ofrece descuentos en comisiones (0.30%), beneficios premium y recompensas por staking. 
Disponible en 10 idiomas, incluye reputación de usuarios, autenticación biométrica, PIN de seguridad, y soporte 24/7 con sistema de disputas. 
SmartX P2P planea integrar DeFi, préstamos y una versión avanzada con IA para finales de 2025.
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
            content: `Responde como Smarty, el asistente oficial de SmartX P2P. Usa el siguiente contexto para responder preguntas:\n\n${SMARTX_SUMMARY}`
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
      return res.status(500).json({ reply: "Smarty no pudo procesar tu mensaje correctamente." });
    }

    res.json({ reply });
  } catch (error) {
    console.error("Error con DeepSeek API:", error?.response?.data || error.message);
    res.status(500).json({ reply: "Ocurrió un error. Por favor intenta nuevamente más tarde." });
  }
});

const PORT = process.env.PORT || 3000;
app.get("/", (req, res) => {
  res.send("✅ Smarty está en línea. Usa POST a /chat para interactuar.");
});
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en el puerto ${PORT}`);
});
