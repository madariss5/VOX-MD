const axios = require('axios');
const fs = require('fs');

const generateImage = async (prompt) => {
    try {
        const response = await axios.get(`https://api.ryzendesu.vip/api/ai/text2img`, {
            params: { prompt: prompt },
            headers: {
                'Accept': 'image/png',
                'User-Agent': 'VOX-MD-BOT/1.0' // Add a User-Agent to bypass Cloudflare
            },
            responseType: 'arraybuffer' // Get binary data
        });

        // Save image as a file (optional)
        fs.writeFileSync('output.png', response.data);
        console.log('Image saved as output.png');
    } catch (error) {
        console.error('Error fetching image:', error.response ? error.response.data : error.message);
    }
};

// Example Usage
generateImage('a girl with glasses pink short hair with uniform and blushing');
