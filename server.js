const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const resumenSmartX = `
SmartX P2P es una plataforma descentralizada de intercambio de criptomonedas, diseñada para que los usuarios puedan comprar y vender activos digitales de manera segura sin intermediarios. Utiliza escrow on-chain, asegurando que los fondos solo se liberen cuando ambas partes cumplen con el acuerdo.

Funciones principales:
- Compra y venta de cripto P2P con escrow on-chain.
- XPAY: transferencias internas gratuitas entre usuarios.
- Generación automática de wallets para USDT (BEP-20), USDC (Polygon) y STX (BEP-20).
- KYC obligatorio.
- Sistema de reputación.
- Soporte multilingüe (Español, Inglés, Árabe, Portugués, Francés, Alemán, Ruso, Chino, Italiano).
- Modo claro/oscuro y diseño responsive.
- Soporte 24/7 y sistema de disputas.

Token $STX:
- Token nativo de la plataforma SmartX P2P.
- Usos:
  - Descuento del 20% en comisiones si se paga con STX.
  - Método de pago interno y futuro sistema de staking.
  - Recompensas para usuarios activos y comerciantes frecuentes.
- Tokenomics:
  - Suministro total definido en contrato.
  - Parte reservada para desarrollo y recompensas.

Seguridad:
- Escrow on-chain en BNB Smart Chain y Polygon.
- PIN de seguridad, autenticación biométrica, monitoreo de actividad, y cifrado AES-256.

Roadmap:
- Q2: Lanzamiento oficial, XPAY, wallets automáticas.
- Q3: Staking, soporte de nuevos tokens.
- Q4: DeFi, préstamos con colateral STX, IA para trading.

Conclusión:
SmartX P2P es más que un simple exchange P2P, es un ecosistema financiero completo para operar con seguridad, eficiencia y bajos costos. Es ideal tanto para usuarios novatos como para traders expertos.
`;

app.post("/chat", async (req, res) => {
  const { message } = req.body;

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "Eres Smarty, el asistente oficial de SmartX P2P. Sé claro, preciso y amable al responder."
          },
          {
            role: "system",
            content: resumenSmartX
          },
          {
            role: "user",
            content: message
          }
        ],
        max_tokens: 300,
        temperature: 0.7
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`
        }
      }
    );

    res.json({ reply: response.data.choices[0].message.content });
  } catch (error) {
    console.error("❌ Error con OpenAI API:", error?.response?.data || error.message);
    res.status(500).json({ reply: "Lo siento, no puedo responder en este momento. Intenta más tarde." });
  }
});

const PORT = process.env.PORT || 3000;
app.get("/", (req, res) => {
  res.send("✅ Smarty (OpenAI) está en línea 🚀. Usa POST a /chat para interactuar.");
});
app.listen(PORT, () => {
  console.log(`🟢 Servidor activo en el puerto ${PORT}`);
});
