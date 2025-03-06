const axios = require("axios");

module.exports = async (context) => {
    const { client, m, args } = context;
    
    // API Key
    const API_KEY = "1c5189a48c15fb72f6809daa2488596c";

    // Validate input
    if (!args[0]) {
        return m.reply("⚠️ *Usage:* `.truecaller <phone-number>`\n\n📌 *Example:* `.truecaller +14158586273`");
    }

    const phoneNumber = args[0].replace(/[^0-9+]/g, ""); // Clean number input
    const apiUrl = `http://apilayer.net/api/validate?access_key=${API_KEY}&number=${phoneNumber}`;

    try {
        const response = await axios.get(apiUrl);
        const data = response.data;

        // Check if the number is valid
        if (!data.valid) {
            return m.reply("❌ *Invalid phone number!* Please check and try again.");
        }

        // Formatted message output
        const resultMsg = `📞 *Phone Lookup Result* 📞

🔹 *Number:* ${data.number}
🔹 *Local Format:* ${data.local_format}
🔹 *International Format:* ${data.international_format}
🔹 *Country:* ${data.country_name} (${data.country_code})
🔹 *Location:* ${data.location || "Unknown"}
🔹 *Carrier:* ${data.carrier || "Unknown"}
🔹 *Network Type:* ${data.line_type || "Unknown"}

🟢 *Powered by VOX-MD*`;

        // Send response
        client.sendMessage(m.chat, { text: resultMsg }, { quoted: m });

    } catch (error) {
        console.error("Error fetching number details:", error);
        m.reply("❌ *Error fetching phone details.* Please try again later.");
    }
};
