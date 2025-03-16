const axios = require("axios");
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

    // Ensure texts is an array
    if (!Array.isArray(texts)) texts = [texts];

    // Convert text array to URL parameters
    const formattedText = texts.map(t => encodeURIComponent(t.trim())).join("&text[]=");

    try {
        // Send request with headers to bypass Cloudflare
        const response = await axios.get(`${url}?text[]=${formattedText}`, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/109.0",
                "Referer": "https://textpro.me/",
                "Origin": "https://textpro.me/"
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