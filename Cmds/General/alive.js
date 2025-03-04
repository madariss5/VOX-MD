const fs = require("fs");
const path = require("path");

module.exports = async (context) => {
    const { client, m, prefix } = context;

    const botname = process.env.BOTNAME || "VOX-MD";

    // Get random image from ./Voxmdgall/
    const galleryPath = path.join(__dirname, "./.../Voxmdgall");
    const files = fs.readdirSync(galleryPath).filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));
    const randomImage = files.length > 0 ? path.join(galleryPath, files[Math.floor(Math.random() * files.length)]) : null;

    // Construct alive message
    const aliveMessage = `✨ *${botname} is Online!*\n\n` +
        `👋 Hello *${m.pushName}*, I'm here to assist you.\n\n` +
        `📌 *Type:* \`${prefix}menu\` *to see my commands.*\n\n` +
        `⚡ Stay connected, and let's have some fun!\n\n` +
        `_Powered by VOX-MD_ 🚀`;

    // Send response with random image
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
