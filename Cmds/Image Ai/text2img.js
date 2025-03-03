const {
  fetchJson, getBuffer, getRandom, fetchBuffer
} = require('./lib/botFunctions.js');

const fetch = require("node-fetch");

module.exports = async (client, m, chatUpdate, store) => {
  try {
    const { text, prefix, command, botname, author, packname, wm } = client;
    const user = global.db.data.users[m.sender];

    if (user.isLoadingAnimeDif) {
      await m.reply("⏱️ Sedang dalam proses, harap tunggu hingga selesai.");
      return;
    }

    if (!text) {
      throw `This command generates images from text prompts.\n\nExample usage:\n${prefix + command} Genshin Impact, Yae Miko, anime girl with glasses, pink short hair, in a uniform, anime style, full body, bokeh`;
    }

    user.isLoadingAnimeDif = true;
    await m.reply("⏳ Processing your request...");
    await client.relayMessage(m.chat, { reactionMessage: { key: m.key, text: '⏱️' } }, { messageId: m.key.id });

    const apiUrl = `https://api.ryzendesu.vip/api/ai/text2img?prompt=${encodeURIComponent(text)}`;

    try {
      const response = await fetch(apiUrl);
      const imageBuffer = await response.buffer();

      await client.sendFile(m.chat, imageBuffer, 'image.jpg', wm, m);
      m.react('✅');
    } catch (error) {
      client.reply(m.chat, '❌ API request failed. Please try again later.', m);
    } finally {
      user.isLoadingAnimeDif = false;
    }
  } catch (err) {
    console.error(`Error in text2img.js: ${err}`);
  }
};
