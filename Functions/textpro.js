const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");

// Load TextPro URLs from textpro.json
const textproPath = path.join(__dirname, "../../textpro.json");
const textProEffects = JSON.parse(fs.readFileSync(textproPath, "utf8"));

async function generateTextProImage(effect, texts) {
    if (!textProEffects[effect]) {
        console.error(`❌ Error: Effect '${effect}' not found in textpro.json`);
        return null;
    }

    const url = textProEffects[effect];
    const form = new FormData();

    // Ensure 'texts' is always an array (some effects need two text inputs)
    if (!Array.isArray(texts)) texts = [texts];

    // Add all text inputs to the form dynamically
    texts.forEach((text, index) => {
        form.append(`text[${index}]`, text);
    });

    try {
        // Make the request to TextPro
        const response = await axios.post(url, form, {
            headers: form.getHeaders(),
            responseType: "arraybuffer" // Get image as Buffer
        });

        return Buffer.from(response.data); // Return image buffer
    } catch (error) {
        console.error(`❌ Error fetching ${effect} effect:`, error);
        return null;
    }
}

module.exports = { generateTextProImage };