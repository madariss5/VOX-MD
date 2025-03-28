const path = require("path");
const fs = require("fs").promises;
const uploadToImgur = require(path.join(__dirname, "../../lib/Imgur.js"));

module.exports = async (context) => {
    const { client, m, quoted } = context;

    let q = quoted ? quoted : m;
    let mime = (q.msg || q).mimetype || "";

    if (!mime) {
        return m.reply("✳️ *Please respond to an image or video!*");
    }

    try {
        // Notify user that upload is in progress
        await client.sendMessage(m.chat, { text: "⏳ *Uploading media... Please wait!*" });

        let mediaBuffer = await q.download();
        if (mediaBuffer.length > 10 * 1024 * 1024) {
            return m.reply("❌ *Media size exceeds 10 MB.* Please upload a smaller file.");
        }

        let tmpDir = path.join(__dirname, "../../tmp");
        await fs.mkdir(tmpDir, { recursive: true });

        let mediaExt = mime.split("/")[1] || "tmp";
        let mediaPath = path.join(tmpDir, `media_${Date.now()}.${mediaExt}`);
        await fs.writeFile(mediaPath, mediaBuffer);

        let isImageOrVideo = /image\/(png|jpe?g|gif)|video\/mp4/.test(mime);

        if (isImageOrVideo) {
            // Upload media using Imgur
            let link = await uploadToImgur(mediaPath);
            const fileSizeMB = (mediaBuffer.length / (1024 * 1024)).toFixed(2);

            await client.sendMessage(m.chat, {
                text: `✅ *Media Upload Successful!*\n\n📁 *File Size:* ${fileSizeMB} MB\n🔗 *URL:* ${link}\n\n✨ _Powered by VOX-MD_`
            });
        } else {
            await client.sendMessage(m.chat, { text: `♕ ${mediaBuffer.length} Byte(s)\n♕ (Unknown Format)` });
        }

        await fs.unlink(mediaPath);
    } catch (error) {
        console.error("Media upload error:", error.message);
        m.reply("❌ *Failed to process your media!* Please try again later.");
    }
};