const fetch = require('node-fetch');

module.exports = async (m, { conn, text }) => {
  if (!text) throw 'Please provide a prompt! Example: *flux dog*';
  
  let url = `https://apis.davidcyriltech.my.id/flux?prompt=${encodeURIComponent(text)}`;

  try {
    await conn.sendFile(m.chat, url, 'flux.jpg', `Here is your Flux image for: *${text}*`, m);
  } catch (err) {
    console.error(err);
    m.reply('Failed to generate image. Please try again.');
  }
};