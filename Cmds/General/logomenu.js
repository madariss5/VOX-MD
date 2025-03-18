const { DateTime } = require('luxon');

module.exports = async (context) => {
    const { client, m, args, prefix } = context;

    try {
        if (!args[0]) {
            return m.reply("*❌ Please provide a text for the logo.*");
        }

        let text = args.join(" ");

        let logomenu = `╔══❖•ೋ°💎 *Sɪʟᴠᴀ Sᴘᴀʀᴋ MD LOGO MAKER* 💎°ೋ•❖══╗\n\n`;
        logomenu += `🔹 *Text:* 〘 ${text} 〙\n`;
        logomenu += `━━━━━━━━━━━━━━\n`;
        logomenu += `🔢 Reply with the number to choose your style:\n\n`;
        logomenu += `1️⃣ ➠ Black Pink\n`;
        logomenu += `2️⃣ ➠ Black Pink 2\n`;
        logomenu += `3️⃣ ➠ Silver 3D\n`;
        logomenu += `4️⃣ ➠ Naruto\n`;
        logomenu += `5️⃣ ➠ Digital Glitch\n`;
        logomenu += `6️⃣ ➠ Pixel Glitch\n`;
        logomenu += `7️⃣ ➠ Comic Style\n`;
        logomenu += `8️⃣ ➠ Neon Light\n`;
        logomenu += `9️⃣ ➠ Free Bear\n`;
        logomenu += `🔟 ➠ Devil Wings\n`;
        logomenu += `1️⃣1️⃣ ➠ Sad Girl\n`;
        logomenu += `1️⃣2️⃣ ➠ Leaves\n`;
        logomenu += `1️⃣3️⃣ ➠ Dragon Ball\n`;
        logomenu += `1️⃣4️⃣ ➠ Hand Written\n`;
        logomenu += `1️⃣5️⃣ ➠ Neon Light\n`;
        logomenu += `1️⃣6️⃣ ➠ 3D Castle Pop\n`;
        logomenu += `1️⃣7️⃣ ➠ Frozen Christmas\n`;
        logomenu += `1️⃣8️⃣ ➠ 3D Foil Balloons\n`;
        logomenu += `1️⃣9️⃣ ➠ 3D Colourful Paint\n`;
        logomenu += `2️⃣0️⃣ ➠ American Flag 3D\n\n`;
        logomenu += `━━━━━━━━━━━━━━\n`;
        logomenu += `> *©💎 Sɪʟᴠᴀ Sᴘᴀʀᴋ MD 💎*\n`;

        await client.sendMessage(m.chat, { text: logomenu }, { quoted: m });

    } catch (err) {
        console.error(err);
        m.reply("*❌ An error occurred while generating the logo. Please try again later!*");
    }
};