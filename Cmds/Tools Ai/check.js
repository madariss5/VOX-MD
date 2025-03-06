module.exports = async (context) => {
    const { client, m, args } = context;

    if (!args[0] || args[0].length < 6 || args[0].length > 7) {
        return m.reply("⚠️ *Invalid Input!*\nPlease provide 6 to 7 digits to find matching numbers.\n\nExample: `.check 0712`");
    }

    let prefix = args[0];
    let generatedNumbers = [];

    for (let i = 0; i < 10; i++) {
        let randomNum = Math.floor(100000 + Math.random() * 900000); // Generates random 6-digit number
        let fullNumber = prefix + randomNum;
        generatedNumbers.push(fullNumber);
    }

    let message = `🔎 *Checking Numbers Matching:* *${prefix}*\n\n`;

    for (let num of generatedNumbers) {
        let waCheck = await client.onWhatsApp(num + "@s.whatsapp.net");

        if (waCheck.length > 0) {
            message += `✅ *+${num}* - *WhatsApp Registered*\n`;
        } else {
            message += `❌ *+${num}* - *Not on WhatsApp*\n`;
        }
    }

    await client.sendMessage(m.chat, { text: message }, { quoted: m });
};
