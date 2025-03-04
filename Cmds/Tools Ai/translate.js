const axios = require("axios");

module.exports = async (context) => {
    const { client, m, text } = context;

    if (!text) {
        return m.reply("🌍 *Enter the text you want to translate!*\n\nExample:\n`.translate Bonjour`");
    }

    try {
        // Notify user that translation is in progress
        await client.sendMessage(m.chat, {
            text: "🔍 *Translating your text... Please wait!* ⏳"
        });

        // API request
        const apiUrl = `https://fastrestapis.fasturl.cloud/tool/translate?text=${encodeURIComponent(text)}&target=en`;
        const response = await axios.get(apiUrl, { headers: { accept: "application/json" } });

        if (response.data.status !== 200) {
            return m.reply("❌ *Translation failed!* Please try again.");
        }

        // Extract translation details
        const { translatedText, from, to } = response.data.result;

        // Construct translation message
        const translationMessage = `🌍 *Translation Complete!*\n\n📝 *Original:* ${text}\n🔤 *Translated:* ${translatedText}\n🗣️ *From:* ${from.toUpperCase()} ➡️ *To:* ${to.toUpperCase()}\n\n✨ _Powered by VOX-MD_`;

        // Send translation result
        await client.sendMessage(m.chat, { text: translationMessage }, { quoted: m });

    } catch (error) {
        console.error("Translation error:", error.message);
        m.reply("❌ *Failed to translate the text!* Please try again later.");
    }
};
