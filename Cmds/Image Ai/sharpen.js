const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");

module.exports = {
    name: "sharpen",
    description: "Enhance an image using AI sharpening.",
    execute: async (client, m) => {
        try {
            // Ensure the message contains a quoted image
            const quotedMsg = m.quoted ? m.quoted : m.message?.extendedTextMessage?.contextInfo?.quotedMessage;
            const isImage = quotedMsg && (quotedMsg.imageMessage || quotedMsg.stickerMessage);

            if (!isImage) {
                return await client.sendMessage(m.chat, { text: "📌 *Reply to an image* with `.sharpen` to enhance it!" }, { quoted: m });
            }

            await client.sendMessage(m.chat, { text: "🔄 Processing your image... Please wait!" }, { quoted: m });

            // Download the image
            let buffer = await client.downloadMediaMessage(quotedMsg);
            let imagePath = "./temp/sharpen.jpg";
            fs.writeFileSync(imagePath, buffer);

            // Upload image to a temporary host
            let form = new FormData();
            form.append("file", fs.createReadStream(imagePath));

            let upload = await axios.post("https://tmpfiles.org/api/upload", form, {
                headers: { ...form.getHeaders() },
            });

            if (!upload.data || !upload.data.url) {
                return await client.sendMessage(m.chat, { text: "❌ Failed to upload image for processing!" }, { quoted: m });
            }

            let imageUrl = upload.data.url;

            // Send to sharpening API
            let sharpened = await axios.get(
                `https://fastrestapis.fasturl.cloud/aiimage/imgsharpen?url=${encodeURIComponent(imageUrl)}`,
                { responseType: "arraybuffer" }
            );

            let outputPath = "./temp/sharpened.jpg";
            fs.writeFileSync(outputPath, sharpened.data);

            // Send the sharpened image
            await client.sendMessage(m.chat, { image: { url: outputPath }, caption: "✅ *Image Sharpened Successfully!*" });

            // Clean up
            fs.unlinkSync(imagePath);
            fs.unlinkSync(outputPath);
        } catch (error) {
            console.error(error);
            await client.sendMessage(m.chat, { text: "❌ Failed to sharpen image! Please try again." }, { quoted: m });
        }
    },
};
