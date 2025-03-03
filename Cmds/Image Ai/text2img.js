const {
  fetchJson, getBuffer, getRandom, fetchBuffer
} = require('./lib/botFunctions.js');

const fetch = require("node-fetch");

module.exports = {
  name: "text2img",
  alias: ["txt2img"],
  category: "ai",
  desc: "Generates an AI image from a text prompt.",
  async execute(client, m, { text, prefix, command }) {
    try {
      const user = global.db.data.users[m.sender];

      if (user.isLoadingAnimeDif) {
        await m.reply("⏱️ Your request is already being processed. Please wait.");
        return;
      }

      if (!text) {
        throw `This command generates images from text prompts.\n\nExample usage:\n${prefix + command} Genshin Impact, Yae Miko, anime girl with glasses, pink short hair, in a uniform, anime style, full body, bokeh`;
      }

      user.isLoadingAnimeDif = true;
      await m.reply("⏳ Processing your request, please wait...");
      await client.relayMessage(m.chat, { reactionMessage: { key: m.key, text: '⏱️' } }, { messageId: m.key.id });

      const apiUrl = `https://api.ryzendesu.vip/api/ai/text2img?prompt=${encodeURIComponent(text)}`;

      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error("API request failed");

      const imageBuffer = await response.buffer();

      await client.sendFile(m.chat, imageBuffer, 'image.jpg', "✅ Here is your AI-generated image!", m);
      await client.relayMessage(m.chat, { reactionMessage: { key: m.key, text: '✅' } }, { messageId: m.key.id });

    } catch (error) {
      console.error(`❌ Error in text2img.js: ${error.message}`);
      client.reply(m.chat, '❌ Sorry, the image generation failed. Please try again later.', m);
    } finally {
      global.db.data.users[m.sender].isLoadingAnimeDif = false;
    }
  }
};
