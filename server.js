const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY; // Variable de entorno

const SMARTX_SUMMARY = `
SmartX P2P es una plataforma descentralizada de intercambio de criptomonedas, diseñada para que los usuarios compren y vendan activos digitales de manera segura sin intermediarios.
Utiliza escrow on-chain para garantizar que los fondos solo se liberen cuando ambas partes cumplan el acuerdo.

🛠️ Funciones principales:
- Compra y venta de criptomonedas con escrow on-chain.
- XPAY: transferencias internas gratuitas sin comisiones.
- Generación automática de wallets para USDT (BEP-20), USDC (Polygon) y STX (BEP-20).
- KYC obligatorio para garantizar seguridad en la plataforma.
- Sistema de reputación y calificación de usuarios.
- Soporte 24/7 y sistema de disputas.

💎 Token SmartX ($STX):
- Permite descuentos en comisiones y será usado para staking y recompensas.
- Tokenomics con suministro definido y verificado en blockchain.

🔐 Seguridad:
- Autenticación biométrica y PIN de seguridad.
- Cifrado AES-256 para claves privadas.
- Monitoreo de actividad sospechosa.

📅 Roadmap:
- Q2 2025: Lanzamiento con funciones principales.
- Q3 2025: Implementación de staking y nuevos métodos de pago.
- Q4 2025: Integración con DeFi y préstamos colateralizados.

SmartX P2P busca ser el mercado P2P más seguro y eficiente del ecosistema cripto.
`;

app.post("/chat", async (req, res) => {
    const { message } = req.body;

    try {
        const response = await axios.post(
            "https://api.deepseek.com/v1/chat/completions",
            {
                model: "deepseek-chat",
                messages: [
                    { role: "system", content: `Eres Smarty, el asistente de SmartX P2P. Usa la siguiente información para responder: ${SMARTX_SUMMARY}` },
                    { role: "user", content: message }
                ],
                max_tokens: 150
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
    console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});
