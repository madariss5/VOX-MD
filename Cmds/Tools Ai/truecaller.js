const axios = require("axios");

module.exports = async (context) => {
    const { client, m, args, text } = context;

    if (!text) {
        return m.reply("❌ *Provide a phone number to lookup!*\nExample: `.truecaller +254700123456`");
    }

    const apiKey = "1c5189a48c15fb72f6809daa2488596c"; // Your API Key
    const number = text.trim();

    const apiUrl = `http://apilayer.net/api/validate?access_key=${apiKey}&number=${encodeURIComponent(number)}&format=1`;

    try {
        m.reply("🔍 *Fetching details... Please wait!*");

        const { data } = await axios.get(apiUrl);

        if (!data.valid) {
            return m.reply("❌ *Invalid phone number! Please check and try again.*");
        }

        const network = data.carrier || "Unknown";
        const country = `${data.country_name} (${data.country_code})`;
        const lineType = data.line_type || "Unknown";
        const registeredName = data.international_format || "Not Available";

        const response = `╭───〔 *📞 Phone Lookup* 〕───╮\n` +
            `│ *📌 Number:* ${registeredName}\n` +
            `│ *🌍 Region:* ${country}\n` +
            `│ *📡 Network:* ${network}\n` +
            `│ *📶 Line Type:* ${lineType}\n` +
            `╰──────────────────────╯`;

        await client.sendMessage(m.chat, { text: response }, { quoted: m });

    } catch (error) {
        console.error(error);
        m.reply("❌ *Error fetching details. Try again later!*");
    }
};
