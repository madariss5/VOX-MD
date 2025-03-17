const fetch = require('node-fetch');

module.exports = async function flux(client, m, text) {
  if (!text) {
    return client.sendMessage(m.chat, '❌ Error: Missing prompt. Usage: *flux dog*', { quoted: m });
  }

  let url = `https://apis.davidcyriltech.my.id/flux?prompt=${encodeURIComponent(text)}`;

  try {
    await client.sendMessage(m.chat, `Generating Flux image for: *${text}*...`, { quoted: m });
    await client.sendMessage(m.chat, { image: { url }, caption: `Here is your Flux image for: *${text}*` }, { quoted: m });
  } catch (err) {
    console.error('❌ Error executing flux:', err);
    client.sendMessage(m.chat, '❌ Failed to generate image. Please try again later.', { quoted: m });
  }
};