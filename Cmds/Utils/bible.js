const axios = require("axios");
const { translate } = require("@vitalets/google-translate-api");

const BASE_URL = "https://bible-api.com";

module.exports = async (context) => {
    const { client, m, text } = context;

    if (!text) return m.reply("❌ Please specify the chapter number or name. Example: *-bible john 3:16*");

    await m.reply("🔄 *Fetching Bible verse... Please wait...*");

    try {
        let chapterInput = encodeURIComponent(text.trim());
        let response = await axios.get(`${BASE_URL}/${chapterInput}`);

        if (!response.data || !response.data.text) {
            return m.reply("❌ Invalid input. Please specify a valid chapter. Example: *-bible john 3:16*");
        }

        let { text: verseText, reference, translation_name, verses } = response.data;

        // Translate into English, Kiswahili, and Hindi
        let translatedEnglish = await translate(verseText, { to: "en", autoCorrect: true });
        let translatedSwahili = await translate(verseText, { to: "sw", autoCorrect: true });
        let translatedHindi = await translate(verseText, { to: "hi", autoCorrect: true });

        let bibleMessage = `
📖 *The Holy Bible*
📜 *Chapter:* ${reference}
📚 *Translation:* ${translation_name}
📖 *Number of verses:* ${verses.length}

🔮 *English:*
${translatedEnglish.text}

💡 *Kiswahili:*
${translatedSwahili.text}

🔮 *Hindi:*
${translatedHindi.text};

        await m.reply(bibleMessage);
    } catch (error) {
        console.error("Bible API Error:", error.message);
        return m.reply("⚠️ An error occurred. Please try again later.");
    }
};