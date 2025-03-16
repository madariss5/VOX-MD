const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");

// Load TextPro URLs from textpro.json
const textproPath = path.join(__dirname, "textpro.json");  // FIXED path issue
const textProEffects = JSON.parse(fs.readFileSync(textproPath, "utf8"));

async function generateTextProImage(effect, texts) {
    if (!textProEffects[effect]) {
        console.error(`❌ Error: Effect '${effect}' not found in textpro.json`);
        return null;
    }

    const url = textProEffects[effect];
    const form = new FormData();

    // Ensure 'texts' is an array
    if (!Array.isArray(texts)) texts = [texts];

    // Add text inputs to the form
    texts.forEach((text, index) => {
        form.append(`text[${index}]`, text);
    });

    try {
        // Send request with headers to bypass Cloudflare
        const response = await axios.post(url, form, {
            headers: {
                ...form.getHeaders(),
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/109.0",
                "Referer": "https://textpro.me/",
                "Origin": "https://textpro.me/"
            },
            responseType: "arraybuffer" // Get image as Buffer
        });

        return Buffer.from(response.data); // Return image buffer
    } catch (error) {
        console.error(`❌ Error fetching '${effect}' effect:`, error.message);
        return null;
    }
}

module.exports = { generateTextProImage };