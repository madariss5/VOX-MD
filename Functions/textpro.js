const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");

// Load TextPro URLs from textpro.json
const textproPath = path.join(__dirname, "../../textpro.json");
const textProEffects = JSON.parse(fs.readFileSync(textproPath, "utf8"));

async function generateTextProImage(effect, text) {
    if (!textProEffects[effect]) return null;

    const url = textProEffects[effect];
    const form = new FormData();
    form.append("text[]", text);

    try {
        const response = await axios.post(url, form, {
            headers: form.getHeaders(),
            responseType: "arraybuffer"
        });

        return response.data; // Return image buffer
    } catch (error) {
        console.error(`Error fetching ${effect} effect:`, error);
        return null;
    }
}

module.exports = { generateTextProImage };