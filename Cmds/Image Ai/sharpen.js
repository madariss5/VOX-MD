const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");

module.exports = async (client, message) => {
    try {
        let { mtype, quoted, chat } = message;

        if (!quoted || !quoted.mtype || !quoted.mtype.includes("image")) {
            return await client.sendMessage(chat, { text: "📌 *Reply to an image* with `.sharpen` to enhance it!" }, { quoted: message });
        }

        await client.sendMessage(chat, { text: "🔄 Processing your image... Please wait!" }, { quoted: message });

        let buffer = await quoted.download();
        let imagePath = "./temp/sharpen.jpg";
        fs.writeFileSync(imagePath, buffer);

        let form = new FormData();
        form.append("file", fs.createReadStream(imagePath));

        let upload = await axios.post("https://tmpfiles.org/api/upload", form, {
            headers: { ...form.getHeaders() },
        });

        if (!upload.data || !upload.data.url) {
            return await client.sendMessage(chat, { text: "❌ Failed to upload image for processing!" }, { quoted: message });
        }

        let imageUrl = upload.data.url;
        let sharpened = await axios.get(
            `https://fastrestapis.fasturl.cloud/aiimage/imgsharpen?url=${encodeURIComponent(imageUrl)}`,
            { responseType: "arraybuffer" }
        );

        let outputPath = "./temp/sharpened.jpg";
        fs.writeFileSync(outputPath, sharpened.data);

        await client.sendMessage(chat, { image: { url: outputPath }, caption: "✅ *Image Sharpened Successfully!*" });

        fs.unlinkSync(imagePath);
        fs.unlinkSync(outputPath);
    } catch (error) {
        console.error(error);
        await client.sendMessage(message.chat, { text: "❌ Failed to sharpen image! Please try again." }, { quoted: message });
    }
};
