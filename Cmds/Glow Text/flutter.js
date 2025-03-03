module.exports = async (context) => {
    const { client, m, text } = context;

    try {
        if (!text) return m.reply("✨ *Enter the text you want to glow!*");

        // Send a waiting message first
        await m.reply("⏳ *Please wait...* Generating your glowing text...");

        const apiUrl = `https://fastrestapis.fasturl.cloud/maker/glowtxt?text=${encodeURIComponent(text)}&style=flutter&glow=2&animation=sweep`;

        await client.sendMessage(
            m.chat,
            {
                gif: { url: apiUrl },
                caption: `💖 *Here is your glowing text:* _"${text}"_`,
            },
            { quoted: m }
        );
    } catch (error) {
        console.error("Glowing text error:", error.message);
        m.reply("❌ *Failed to generate glowing text!*");
    }
};
