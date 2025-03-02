const axios = require("axios");
const fs = require("fs");
const path = require("path");

async function text2img(client, message, args) {
    try {
        if (!args.length) return message.reply("❌ *Please provide a prompt for the AI image!*");

        const prompt = encodeURIComponent(args.join(" "));
        const apiUrl = `https://api.ryzendesu.vip/api/ai/text2img?prompt=${prompt}`;
        const headers = { "Accept": "image/png" };

        const response = await axios.get(apiUrl, { headers, responseType: "arraybuffer" });

        if (response.status !== 200) return message.reply("⚠️ *Failed to generate image. Try again!*");

        const imagePath = path.join(__dirname, "generated.png");
        fs.writeFileSync(imagePath, response.data);

        await client.sendMessage(message.key.remoteJid, {
            document: fs.readFileSync(imagePath),
            mimetype: "image/png",
            fileName: "AI_Image.png",
            caption: "✨ *Here is your AI-generated image!*"
        });

        fs.unlinkSync(imagePath);
    } catch (error) {
        console.error("❌ Error in text2img:", error);
        message.reply("❌ *An error occurred while generating the image.*");
    }
}

module.exports = { name: "text2img", execute: text2img };
