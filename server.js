const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY; // Variable de entorno

// 📌 Resumen completo de SmartX P2P para Smarty
const SMARTX_SUMMARY = `
SmartX P2P es una plataforma descentralizada de intercambio de criptomonedas que permite comprar y vender activos digitales sin intermediarios mediante un sistema de escrow on-chain. 

🔹 **Funciones Principales:**
✅ Compra y venta de criptomonedas P2P con escrow on-chain.  
✅ XPAY: Transferencias internas gratuitas entre usuarios sin comisiones.  
✅ Generación automática de wallets para USDT (BEP-20), USDC (Polygon) y STX (BEP-20).  
✅ KYC obligatorio para garantizar seguridad en la plataforma.  
✅ Sistema de reputación y calificación de usuarios.  
✅ Multilingüe: Disponible en 9 idiomas.  
✅ Soporte 24/7 y resolución de disputas.  
✅ Penalizaciones automáticas para cancelaciones abusivas.  

💎 **Token SmartX ($STX):**  
✅ Pago de comisiones con descuento del 20% en STX.  
✅ Recompensas y sistema de staking en Q3 2025.  
✅ Seguridad avanzada con autenticación biométrica y cifrado AES-256.  

📅 **Roadmap:**  
🚀 Q2 2025 → Lanzamiento con funciones clave.  
🚀 Q3 2025 → Staking y expansión de pagos.  
🚀 Q4 2025 → Integración con DeFi y préstamos colateralizados.  

SmartX P2P busca ser la referencia en comercio P2P cripto con escrow seguro y un ecosistema descentralizado eficiente.
`;

app.post("/chat", async (req, res) => {
    const { message } = req.body;

    try {
        const response = await axios.post(
            "https://api.deepseek.com/v1/chat/completions",
            {
                model: "deepseek-chat",
                messages: [
                    { role: "system", content: `Eres Smarty, el asistente de SmartX P2P. Responde todas las preguntas usando la siguiente información:\n\n${SMARTX_SUMMARY}` },
                    { role: "user", content: message }
                ],
                max_tokens: 200
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
