const fs = require("fs");
const path = require("path");

module.exports = async (context) => {
    const { client, m, prefix } = context;
    const botname = process.env.BOTNAME || "VOX-MD";

    // Correct path to Voxmdgall (since it's in the repo root)
    const galleryPath = path.resolve(__dirname, "../../Voxmdgall");

    let randomImage = null;

    // Check if the folder exists
    if (fs.existsSync(galleryPath)) {
        const files = fs.readdirSync(galleryPath).filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));
        if (files.length > 0) {
            randomImage = path.join(galleryPath, files[Math.floor(Math.random() * files.length)]);
        }
    }

    // Construct alive message
    const aliveMessage = `✨ *${botname} is Online!*\n\n` +
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
