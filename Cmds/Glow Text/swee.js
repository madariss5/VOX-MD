const axios = require("axios");
const Jimp = require("jimp");
const fs = require("fs");
const path = require("path");

module.exports = async (context) => {
    const { client, m, text } = context;

    try {
        if (!text) return m.reply("✨ *Enter the text you want to glow!*");

        const apiUrl = `https://fastrestapis.fasturl.cloud/maker/glowtxt?text=${encodeURIComponent(text)}&style=sweetheart&glow=1&animation=pulse`;

        // Download image from API
        const response = await axios({ url: apiUrl, responseType: "arraybuffer" });
        const imageBuffer = Buffer.from(response.data);

        // Resize the image using Jimp
        const image = await Jimp.read(imageBuffer);
        image.resize(500, 500); // Resize to 500x500

        // Save the resized image temporarily
        const tempPath = path.join(__dirname, "temp_glowtext.png");
        await image.writeAsync(tempPath);

        // Send the resized image
        await client.sendMessage(
            m.chat,
            {
                image: fs.readFileSync(tempPath),
                caption: `💖 *Here is your glowing text:* _"${text}"_`,
            },
            { quoted: m }
        );

        // Delete the temp file after sending
        fs.unlinkSync(tempPath);
    } catch (error) {
        console.error("Glowing text error:", error.message);
        m.reply("❌ *Failed to generate glowing text!*");
    }
};
