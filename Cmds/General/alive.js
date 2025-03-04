const fs = require("fs");
const path = require("path");

module.exports = async (context) => {
    const { client, m, prefix } = context;
    const botname = process.env.BOTNAME || "VOX-MD";

    // Function to get a random image from the folder
    const getRandomThumbnail = () => {
        const assetsPath = path.join(__dirname, "../../Voxmdgall");
        if (!fs.existsSync(assetsPath)) throw new Error("🚫 Voxmdgall folder not found!");

        const images = fs.readdirSync(assetsPath).filter(file => /\.(jpg|jpeg|png)$/i.test(file));
        if (images.length === 0) throw new Error("🚫 No images found in Voxmdgall!");

        const randomImage = images[Math.floor(Math.random() * images.length)];
        return path.join(assetsPath, randomImage); // Return full path
    };

    // Construct alive message
    const aliveMessage = `✨ *${botname} is Online✅!*\n\n` +
        `👋 Hello *${m.pushName}*, I'm here to assist you.\n\n` +
        `📌 *Type:* \`${prefix}menu\` *to see my commands.*\n\n` +
        `⚡ Stay connected, and let's have some fun!\n\n` +
        `_Powered by VOX-MD_ 🚀`;

    try {
        const imagePath = getRandomThumbnail();
        const imageBuffer = fs.readFileSync(imagePath); // Read the image as a buffer

        await client.sendMessage(
            m.chat,
            {
                image: imageBuffer, // Send the image as a buffer
                caption: aliveMessage
            },
            { quoted: m }
        );
    } catch (error) {
        console.error("Error sending image:", error);
        await m.reply(aliveMessage);
    }
};
