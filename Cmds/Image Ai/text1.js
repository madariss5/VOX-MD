const fetch = require("node-fetch");

module.exports = async (context) => {
    const { client, m, text, usedPrefix, command } = context;
    const user = global.db.data.users[m.sender];

    if (user.isLoadingAnimeDif) {
        return client.sendMessage(m.chat, { text: "⏳ Processing... Please wait until the previous request is completed." }, { quoted: m });
    }

    if (!text) {
        return client.sendMessage(m.chat, { text: `🔍 This command generates images from text prompts.\n\n💡 *Example Usage:*\n\`${usedPrefix + command} Genshin Impact, Yae Miko, anime girl with glasses, pink short hair, in a uniform, anime style, full body, bokeh\`` }, { quoted: m });
    }

    user.isLoadingAnimeDif = true;
    await client.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });

    const apiUrl = `https://api.ryzendesu.vip/api/ai/text2img?prompt=${encodeURIComponent(text)}`;

    try {
        const response = await fetch(apiUrl);
        const imageBuffer = await response.buffer();
        const base64Image = imageBuffer.toString("base64");

        const caption = `╭─── 〔 *AI Image Generator* 〕 ───✦\n` +
                        `│ 🎨 *Prompt:* ${text}\n` +
                        `│ ✅ *Status:* Successfully Generated\n` +
                        `╰───────────────✦\n\n` +
                        `_Powered by ©VOXNET.INC_\n_BOT NAME: VOX-MD_\n_OWNER: KANAMBO_`;

        await client.sendMessage(m.chat, { 
            image: { url: `data:image/jpeg;base64,${base64Image}` }, 
            caption 
        }, { quoted: m });

        await client.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
    } catch (error) {
        console.error(error);
        client.sendMessage(m.chat, { text: "❌ An error occurred while generating the image. Please try again later." }, { quoted: m });
    } finally {
        user.isLoadingAnimeDif = false;
    }
};
