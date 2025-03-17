const axios = require("axios");

module.exports = async (context) => {
    const { client, m, text } = context;

    if (!text) {
        return m.reply("❌ *Please provide a mathematical expression!*\n\nExample usage:\n`.calc 5+3*2`");
    }

    try {
        // Notify user that the calculation is in progress
        await client.sendMessage(m.chat, { 
            text: "🧮 *Calculating... Please wait!* ⏳" 
        });

        // Construct API URL
        const apiUrl = `https://apis.davidcyriltech.my.id/tools/calculate?expr=${encodeURIComponent(text)}`;

        // Make API request
        const response = await axios.get(apiUrl);
        const result = response.data.result;

        // Send the calculated result
        await client.sendMessage(
            m.chat,
            {
                text: `📊 *Calculation Result:*\n\n📝 _Expression:_ ${text}\n✅ _Answer:_ *${result}*`,
            },
            { quoted: m }
        );
    } catch (error) {
        console.error("Calculator API error:", error.message);
        m.reply("❌ *Failed to calculate! Please check your expression and try again.*");
    }
};