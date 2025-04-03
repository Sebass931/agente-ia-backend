const express = require('express');
const axios = require('axios');
const app = express();

// Configuración (¡CAMBIAR ESTO!)
const D_ID_API_KEY = process.env.D_ID_API_KEY;
const AVATAR_IMAGE_URL = process.env.AVAR_IMAGE_URL;

app.use(express.json());

// Endpoint para generar video
app.post('/generate-video', async (req, res) => {
    try {
        const { text } = req.body;

        // Llama a D-ID con Basic Auth (¡cambio crítico!)
        const response = await axios.post(
            'https://api.d-id.com/talks',
            {
                script: text,
                source_url: AVATAR_IMAGE_URL
            },
            {
                auth: {
                    username: 'default', // Siempre es 'default'
                    password: D_ID_API_KEY // Tu API Key real
                },
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 8000 // 8 segundos máximo
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

// Inicia el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));