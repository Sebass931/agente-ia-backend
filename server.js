const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

// Configuración (¡CAMBIAR ESTO!)
const D_ID_API_KEY = 'c2ViYXN0aWFuLnNhbmNoZXpAc29jaWFicG8uY29t:KEt3gZWtHeZjz1OOFJvox';
const AVATAR_IMAGE_URL = 'https://asset.cloudinary.com/dynpjg6wh/96beae9cf5aa257560223bcb98893b0a'; 

app.use(cors());
app.use(express.json());

app.post('/generate-video', async (req, res) => {
    try {
        const { text } = req.body;
        
        // Validación básica
        if (!text || typeof text !== 'string') {
            return res.status(400).json({ error: "El campo 'text' es requerido y debe ser una cadena" });
        }

        // Llamada a D-ID API
        const response = await axios.post(
            'https://api.d-id.com/talks',
            {
                script: text,
                source_url: AVATAR_IMAGE_URL // Asegúrate de que esta variable esté definida
            },
            {
                headers: {
                    'Authorization': `Bearer ${D_ID_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                timeout: 10000 // 10 segundos máximo de espera
            }
        );

        // Verifica que la respuesta de D-ID sea válida
        if (!response.data?.result_url) {
            console.error("Respuesta inesperada de D-ID:", response.data);
            return res.status(500).json({ error: "La API de D-ID no devolvió un enlace válido" });
        }

        res.json({ videoUrl: response.data.result_url });

    } catch (error) {
        // Captura errores específicos de Axios/D-ID
        console.error("Error detallado:", {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
        });

        let errorMessage = "Error al generar el video";
        if (error.response?.status === 401) {
            errorMessage = "API Key de D-ID inválida o sin créditos";
        } else if (error.code === 'ECONNABORTED') {
            errorMessage = "Timeout al conectar con D-ID";
        }

        res.status(500).json({ error: errorMessage });
    }
});

const PORT = process.env.PORT || 3000;
app.get("/", (req, res) => {
    res.send("¡Backend del agente de IA funcionando! Usa POST /generate-video");
  });
app.listen(PORT, () => console.log(`Servidor listo en puerto ${PORT}`));