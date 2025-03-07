const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");

module.exports = async (context) => {
    const { client, m, quoted, mime } = context;

    if (!quoted || !mime || !mime.startsWith("image/")) {
        return m.reply("📌 *Reply to an image* with `.sharpen` to enhance it!");
    }

    let media = await client.downloadMediaMessage(quoted);
    let filePath = "./temp.jpg";
    fs.writeFileSync(filePath, media);

    // Step 1: Upload Image
    let uploadUrl = "https://telegra.ph/upload"; // Using Telegra.ph for temporary hosting
    let form = new FormData();
    form.append("file", fs.createReadStream(filePath));

    let uploadResponse;
    try {
        uploadResponse = await axios.post(uploadUrl, form, {
            headers: { ...form.getHeaders() },
        });
    } catch (error) {
        return m.reply("❌ *Image upload failed!*");
    }

    let imgUrl = "https://telegra.ph" + uploadResponse.data[0].src;

    // Step 2: Apply AI Sharpening
    let apiUrl = `https://fastrestapis.fasturl.cloud/aiimage/imgsharpen?url=${encodeURIComponent(imgUrl)}`;
    try {
        let response = await axios.get(apiUrl, { responseType: "arraybuffer" });

        // Save sharpened image
        let outputFile = "./sharpened.jpg";
        fs.writeFileSync(outputFile, response.data);

        await client.sendMessage(m.chat, { image: { url: outputFile }, caption: "✨ *Sharpened Image!*" }, { quoted: m });

        // Cleanup
        fs.unlinkSync(filePath);
        fs.unlinkSync(outputFile);
    } catch (error) {
        return m.reply("❌ *Failed to sharpen the image!*");
    }
};
