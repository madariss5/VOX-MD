const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");

// Load TextPro URLs from textpro.json
const textproPath = path.join(__dirname, "textpro.json");
const textProEffects = JSON.parse(fs.readFileSync(textproPath, "utf8"));

async function generateTextProImage(effect, texts) {
    if (!textProEffects[effect]) {
        console.error(`❌ Error: Effect '${effect}' not found in textpro.json`);
        return null;
    }

    const url = textProEffects[effect];
    const form = new FormData();

    if (!Array.isArray(texts)) texts = [texts]; // Ensure texts is an array
    texts.forEach((text, index) => {
        form.append(`text[${index}]`, text.trim()); // Trim spaces to avoid issues
    });

    try {
        const response = await axios.post(url, form, {
            headers: {
                ...form.getHeaders(),
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/110.0",
                "Referer": "https://textpro.me/",
                "Origin": "https://textpro.me/",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                "Connection": "keep-alive",
                "Upgrade-Insecure-Requests": "1"
            },
            responseType: "arraybuffer"
        });

        return Buffer.from(response.data); // Return image buffer
    } catch (error) {
        console.error(`❌ Error fetching '${effect}' effect:`, error.message);
        return null;
    }
}

module.exports = { generateTextProImage };