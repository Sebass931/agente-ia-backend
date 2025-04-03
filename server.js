const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

// Configuración (¡CAMBIAR ESTO!)
const D_ID_API_KEY = 'c2ViYXN0aWFuLnNhbmNoZXpAc29jaWFicG8uY29t:YgNp9U1j54ddOW6MYUu6-';
const AVATAR_IMAGE_URL = 'https://ibb.co/qFPVJcxn'; 

app.use(cors());
app.use(express.json());

app.post('/generate-video', async (req, res) => {
    try {
        const { text } = req.body;
        const response = await axios.post(
            'https://api.d-id.com/talks',
            { script: text, source_url: AVATAR_IMAGE_URL },
            { headers: { 'Authorization': `Bearer ${D_ID_API_KEY}` } }
        );
        res.json({ videoUrl: response.data.result_url });
    } catch (error) {
        res.status(500).json({ error: 'Error al generar el video' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor listo en puerto ${PORT}`));