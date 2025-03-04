const fs = require("fs");
const path = require("path");

module.exports = async (context) => {
    const { client, m, prefix } = context;
    const botname = process.env.BOTNAME || "VOX-MD";

    // Function to get a random image or GIF (supports .webp, .jpg, .jpeg, .png, .gif)
    const getRandomMedia = () => {
        const assetsPath = path.join(__dirname, "../../Voxmdgall"); // Make sure this path is correct
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
        const mediaPath = getRandomMedia(); // Get a random media file
        const mediaBuffer = fs.readFileSync(mediaPath); // Read the file as a buffer

        // Determine the correct MIME type
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

        // Send the image or GIF as an actual buffer (WhatsApp-friendly)
        await client.sendMessage(
            m.chat,
            {
                image: mediaBuffer,
