const fs = require("fs");
const path = require("path");

module.exports = async (context) => {
    const { client, m, prefix } = context;
    const botname = process.env.BOTNAME || "VOX-MD";

    // Function to get a random thumbnail from Voxmdgall
    const getRandomThumbnail = () => {
        const assetsPath = path.join(__dirname, '../../Voxmdgall'); 
        if (!fs.existsSync(assetsPath)) throw new Error("🚫 Voxmdgall folder not found!");

        const images = fs.readdirSync(assetsPath).filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));
        if (images.length === 0) throw new Error("🚫 No images found in Voxmdgall!");

        const randomImage = images[Math.floor(Math.random() * images.length)];
        return path.join(assetsPath, randomImage); // Return image file path
    };

    let imagePath;
    try {
        imagePath = getRandomThumbnail(); // Call function and store result
    } catch (error) {
        console.error(error.message);
        imagePath = null;
    }

    // Construct alive message
    const aliveMessage = `✨ *${botname} is Online✅!*\n\n` +
        `👋 Hello *${m.pushName}*, I'm here to assist you.\n\n` +
        `📌 *Type:* \`${prefix}menu\` *to see my commands.*\n\n` +
        `⚡ Stay connected, and let's have some fun!\n\n` +
        `_Powered by VOX-MD_ 🚀`;

    // Send response with random image if available
    if (imagePath) {
        await client.sendMessage(
            m.chat,
            {
                image: { url: `file://${imagePath}` },
                caption: aliveMessage,
                fileLength: "9999999999898989899999999"
            },
            { quoted: m }
        );
    } else {
        await m.reply(aliveMessage);
    }
};
