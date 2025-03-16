const { generateTextProImage } = require("../../functions/textpro");

module.exports = async (context) => {
    const { client, m, args } = context;

    if (args.length === 0) {
        return m.reply("⚠️ Please provide text.\nExample: *.neon Hello*");
    }

    const text = args.join(" ");
    const imageBuffer = await generateTextProImage("neon", text);

    if (!imageBuffer) {
        return m.reply("❌ Error: Failed to generate Neon Text.");
    }

    await client.sendMessage(m.chat, {
        image: imageBuffer,
        caption: `🌟 *Neon Glow Effect:* ${text}`
    }, { quoted: m });
};