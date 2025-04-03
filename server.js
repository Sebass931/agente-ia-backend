const express = require('express');
const axios = require('axios');
const app = express();

// Carga variables .env en desarrollo
if (process.env.NODE_ENV !== 'production') require('dotenv').config();

// Configuración
const D_ID_API_KEY = process.env.D_ID_API_KEY;
const AVATAR_IMAGE_URL = process.env.AVATAR_IMAGE_URL; // ¡Nombre corregido!

app.use(express.json());

// Endpoint para generar video
app.post('/generate-video', async (req, res) => {
    try {
        const { text } = req.body;

        // Validación
        if (!text || typeof text !== 'string') {
            return res.status(400).json({ error: "El campo 'text' es requerido" });
        }

        // Llama a D-ID
        const response = await axios.post(
            'https://api.d-id.com/talks',
            { script: text, source_url: AVATAR_IMAGE_URL },
            {
                auth: { username: 'default', password: D_ID_API_KEY },
                headers: { 'Content-Type': 'application/json' },
                timeout: 8000
            }
        );

        res.json({ videoUrl: response.data.result_url });

    } catch (error) {
        console.error('Error con D-ID:', error.response?.data || error.message);
        res.status(500).json({ 
            error: "Error al generar el video",
            details: error.response?.data || null
        });
    }
});

// Ruta raíz
app.get('/', (req, res) => {
    res.send('API del Agente de IA. Usa POST /generate-video');
});

// Inicia el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));