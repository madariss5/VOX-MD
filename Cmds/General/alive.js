const fs = require("fs");
const path = require("path");

module.exports = async (context) => {
    const { client, m, prefix } = context;
    const botname = process.env.BOTNAME || "VOX-MD";

    // Function to get a random image or GIF
    const getRandomMedia = () => {
        const assetsPath = path.join(__dirname, "../../Voxmdgall");
        if (!fs.existsSync(assetsPath)) throw new Error("🚫 Voxmdgall folder not found!");

        const files = fs.readdirSync(assetsPath).filter(file => /\.(jpg|jpeg|png|webp|gif)$/i.test(file));
        if (files.length === 0) throw new Error("🚫 No images or GIFs found in Voxmdgall!");

        const randomFile = files[Math.floor(Math.random() * files.length)];
        return {
            path: path.join(assetsPath, randomFile),
            isGif: randomFile.endsWith(".gif")
        };
    };

    try {
        const { path: mediaPath, isGif } = getRandomMedia();

        // Construct alive message
        const aliveMessage = `✨ *${botname} is Online✅!*\n\n` +
            `👋 Hello *${m.pushName}*, I'm here to assist you.\n\n` +
            `📌 *Type:* \`${prefix}menu\` *to see my commands.*\n\n` +
            `⚡ Stay connected, and let's have some fun!\n\n` +
            `_Powered by VOX-MD_ 🚀`;

        // Send image or GIF correctly
        const mediaOptions = isGif
            ? { video: fs.readFileSync(mediaPath), caption: aliveMessage, gifPlayback: true }
            : { image: fs.readFileSync(mediaPath), caption: aliveMessage };

        await client.sendMessage(m.chat, mediaOptions, { quoted: m });

    } catch (error) {
        console.error("❌ Error in alive.js:", error);
        await m.reply("❌ Error: Unable to send image/GIF. Check if the `Voxmdgall` folder has valid media files.");
    }
};
