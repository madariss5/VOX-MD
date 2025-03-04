const axios = require("axios");

module.exports = {
  name: "translate",
  description: "Translates text from any language to English.",
  async execute(m, { text }) {
    if (!text) {
      return m.reply("Please provide the text you want to translate.");
    }

    try {
      const apiUrl = `https://fastrestapis.fasturl.cloud/tool/translate?text=${encodeURIComponent(text)}&target=en`;
      const response = await axios.get(apiUrl, { headers: { accept: "application/json" } });

      if (response.data.status === 200) {
        const translatedText = response.data.result.translatedText;
        m.reply(`*Translated Text:*\n${translatedText}`);
      } else {
        m.reply("Translation failed. Please try again.");
      }
    } catch (error) {
      console.error(error);
      m.reply("An error occurred while translating the text.");
    }
  },
};
