const fs = require("fs");
const path = require("path");

module.exports = async (context) => {
    const { client, m, prefix } = context;
    const botname = process.env.BOTNAME || "VOX-MD";

    // Correct path to Voxmdgall (since it's in the repo root)
    const getRandomThumbnail = () => {
            const assetsPath = path.join(__dirname, '../../Voxmdgall'); 
            if (!fs.existsSync(assetsPath)) throw new Error("🚫 Voxmdgall folder not found!");

            const images = fs.readdirSync(assetsPath).filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));
            if (images.length === 0) throw new Error("🚫 No images found in Voxmdgall!");

            const randomImage = images[Math.floor(Math.random() * images.length)];
            return fs.readFileSync(path.join(assetsPath, randomImage)); // Return image buffer
        };


    // Construct alive message
    const aliveMessage = `✨ *${botname} is Online✅!*\n\n` +
        `👋 Hello *${m.pushName}*, I'm here to assist you.\n\n` +
        `📌 *Type:* \`${prefix}menu\` *to see my commands.*\n\n` +
        `⚡ Stay connected, and let's have some fun!\n\n` +
        `_Powered by VOX-MD_ 🚀`;

    // Send response with random image if available
    if (randomImage) {
        await client.sendMessage(
            m.chat,
            {
                image: { url: `file://${randomImage}` },
                caption: aliveMessage,
                fileLength: "9999999999898989899999999"
            },
            { quoted: m }
        );
    } else {
        await m.reply(aliveMessage);
    }
};
