const axios  = require("axios")

module.exports.logo = async (client, message, args) => {
  try {
    if (!args[0]) {
      return message.reply("*_Please provide a text for the logo._*");
    }

    let text = args.join(" ");
    let logomenu = `*🤍 💎 Sɪʟᴠᴀ Sᴘᴀʀᴋ MD 💎 LOGO MAKER 💫*\n\n`
      + `╼╼╼╼╼╼╼╼╼╼╼╼╼╼╼╼╼➻\n`
      + `*◈ Text :* ${text}\n`
      + `╼╼╼╼╼╼╼╼╼╼╼╼╼╼╼╼╼➻\n\n`
      + `*🔢 Reply with the number for your desired style ➠*\n\n`
      + `1 ➠ Black Pink\n`
      + `2 ➠ Black Pink 2\n`
      + `3 ➠ Silver 3D\n`
      + `4 ➠ Naruto\n`
      + `5 ➠ Digital Glitch\n`
      + `6 ➠ Pixel Glitch\n`
      + `7 ➠ Comic Style\n`
      + `8 ➠ Neon Light\n`
      + `9 ➠ Free Bear\n`
      + `10 ➠ Devil Wings\n`
      + `11 ➠ Sad Girl\n`
      + `12 ➠ Leaves\n`
      + `13 ➠ Dragon Ball\n`
      + `14 ➠ Hand Written\n`
      + `15 ➠ Neon Light\n`
      + `16 ➠ 3D Castle Pop\n`
      + `17 ➠ Frozen Christmas\n`
      + `18 ➠ 3D Foil Balloons\n`
      + `19 ➠ 3D Colourful Paint\n`
      + `20 ➠ American Flag 3D\n\n`
      + `> *©💎 Sɪʟᴠᴀ Sᴘᴀʀᴋ MD 💎*`;

    await client.sendMessage(message.from, { text: logomenu }, { quoted: message });

  } catch (err) {
    console.error(err);
    message.reply("*An error occurred while generating the logo. Please try again later!*");
  }
};