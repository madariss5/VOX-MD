const { fetchJson, getBuffer, getRandom } = require('../../lib/botFunctions.js');
const fetch = require("node-fetch");

module.exports = async (client, m, chatUpdate, store) => {
  try {
    const { text, prefix, command, botname, author, packname, wm } = client;
    
    // Ensure global.db and users exist
    const user = (global.db && global.db.data && global.db.data.users) ? global.db.data.users[m.sender] : {};

    if (user.isLoadingAnimeDif) {
      await m.reply("⏱️ Processing, please wait...");
      return;
    }

    if (!text) {
      throw `This command generates AI images from text prompts.\n\nExample:\n${prefix + command} anime girl, cyberpunk style, futuristic background`;
    }

    user.isLoadingAnimeDif = true;
    await m.reply("⏳ Processing your request...");

    const apiUrl = `https://api.ryzendesu.vip/api/ai/text2img?prompt=${encodeURIComponent(text)}`;

    try {
      const response = await fetch(apiUrl);
      const imageBuffer = await response.buffer();

      await client.sendFile(m.chat, imageBuffer, 'image.jpg', wm, m);
      m.react('✅');
    } catch (error) {
      client.reply(m.chat, '❌ API request failed. Try again later.', m);
    } finally {
      user.isLoadingAnimeDif = false;
    }
  } catch (err) {
    console.error(`Error in text2img.js: ${err}`);
  }
};
