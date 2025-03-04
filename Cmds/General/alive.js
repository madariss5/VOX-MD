const fs = require("fs");
const path = require("path");

module.exports = async (context) => {
    const { client, m, prefix } = context;
    const botname = process.env.BOTNAME || "VOX-MD";

    // Function to get a random media file (supports .webp, .jpg, .jpeg, .png, .gif)
    const getRandomMedia = () => {
        const assetsPath = path.join(__dirname, "../../Voxmdgall"); 
        if (!fs.existsSync(assetsPath)) throw new Error("🚫 Voxmdgall folder not found!");

        const mediaFiles = fs.readdirSync(assetsPath).filter(file => /\.(webp|jpg|jpeg|png|gif)$/i.test(file));
        if (mediaFiles.length === 0) throw new Error("🚫 No media files found in Voxmdgall!");

        return path.join(assetsPath, mediaFiles[Math.floor(Math.random() * mediaFiles.length)]);
    };

    // Alive message content
    const aliveMessage = `✨ *${botname} is Online✅!*\n\n` +
        `👋 Hello *${m.pushName}*, I'm here to assist you.\n\n` +
        `📌 *Type:* \`${prefix}menu\` *to see my commands.*\n\n` +
        `⚡ Stay connected, and let's have some fun!\n\n` +
        `_Powered by VOX-MD_ 🚀`;

    try {
        const mediaPath = getRandomMedia(); 
        const mediaBuffer = fs.readFileSync(mediaPath);

        let mediaMimeType;
        if (mediaPath.endsWith(".jpg") || mediaPath.endsWith(".jpeg")) {
            mediaMimeType = "image/jpeg";
        } else if (mediaPath.endsWith(".png")) {
            mediaMimeType = "image/png";
        } else if (mediaPath.endsWith(".gif")) {
            mediaMimeType = "image/gif";
        } else if (mediaPath.endsWith(".webp")) {
            mediaMimeType = "image/webp";
        } else {
            throw new Error("🚫 Unsupported media format!");
        }

        // Send image/GIF
        await client.sendMessage(
            m.chat,
            {
                image: mediaBuffer,
                mimetype: mediaMimeType,
                caption: aliveMessage
            },
            { quoted: m }
        );
    } catch (error) {
        console.error("❌ Error in alive.js:", error);
        await m.reply(`⚠️ *Error:* Could not load image. Here is the text version:\n\n${aliveMessage}`);
    }
};
