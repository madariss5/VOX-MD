const fetch = require("node-fetch");

module.exports = async (client, m, chatUpdate, store) => {
  try {
    const { prefix, command, args } = m;
    
    if (!args.length) {
      throw `This command generates AI images from text prompts.\n\nExample usage:\n${prefix + command} anime girl, cyberpunk style, futuristic background`;
    }

    const text = args.join(" "); // Join all arguments into a single prompt

    await m.reply("⏳ Generating AI image, please wait...");

    const apiUrl = `https://api.ryzendesu.vip/api/ai/text2img?prompt=${encodeURIComponent(text)}`;
    
    const response = await fetch(apiUrl);
    const jsonResponse = await response.json();

    // Check if API returned an error
    if (!jsonResponse || !jsonResponse.data || !jsonResponse.data.image) {
      throw `❌ API Error: Invalid response.\nPlease try again later.`;
    }

    const imageUrl = jsonResponse.data.image;
    
    await client.sendMessage(m.chat, { image: { url: imageUrl }, caption: `✅ *AI Image Generated*\n\nPrompt: ${text}` }, { quoted: m });

  } catch (err) {
    console.error(`Error in text2img.js: ${err}`);
    m.reply(`❌ Error: ${err}`);
  }
};
