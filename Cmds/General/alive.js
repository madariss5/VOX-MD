const fs = require("fs");
const path = require("path");

module.exports = async (context) => {
    const { client, m, prefix } = context;
    const botname = process.env.BOTNAME || "VOX-MD";

    // Function to get a random image (supports .webp, .jpg, .jpeg, .png, .gif)
    const getRandomMedia = () => {
        const assetsPath = path.join(__dirname, "../../Voxmdgall"); // Adjust path as needed
        if (!fs.existsSync(assetsPath)) throw new Error("🚫 Voxmdgall folder not found!");

        const mediaFiles = fs.readdirSync(assetsPath).filter(file => /\.(webp|jpg|jpeg|png|gif)$/i.test(file));
        if (mediaFiles.length === 0) throw new Error("🚫 No media files found in Voxmdgall!");

        return path.join(assetsPath, mediaFiles[Math.floor(Math.random() * mediaFiles.length)]);
    };

    // Construct alive message
    const aliveMessage = `✨ *${botname} is Online✅!*\n\n` +
        `👋 Hello *${m.pushName}*, I'm here to assist you.\n\n` +
        `📌 *Type:* \`${prefix}menu\` *to see my commands.*\n\n` +
        `⚡ Stay connected, and let's have some fun!\n\n` +
        `_Powered by VOX-MD_ 🚀`;

    try {
        const mediaPath = getRandomMedia(); // Get random media file
        const mediaBuffer = fs.readFileSync(mediaPath); // Read the file as a buffer
        const mediaMimeType = mediaPath.endsWith(".gif") ? "image/gif" : "image/jpeg"; // Detect format

        await client.sendMessage(
            m.chat,
            {
                image: mediaBuffer, // Send actual image/GIF as buffer
                mimetype: mediaMimeType,
                caption: aliveMessage
            },
            { quoted: m }
        );
    } catch (error) {
        console.error("❌ Error sending alive message:", error);
        await m.reply(aliveMessage);
    }
};
