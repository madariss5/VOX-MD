const fetch = require('node-fetch');

module.exports = async (context) => {
    try {
        const { m, text } = context;
        if (!text) return m.reply("⚠️ Please provide a prompt for the AI image!");

        // ✅ Use the correct API endpoint and parameters
        const apiUrl = `https://api.ryzendesu.vip/api/ai/v2/text2img?prompt=${encodeURIComponent(text)}&model=flux_dev`;

        // ✅ Add headers (Check if an API key is required)
        let headers = {
            "accept": "image/png",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)", // Spoof browser user-agent
            // "Authorization": "Bearer YOUR_API_KEY"  // 🔴 Uncomment if an API key is needed
        };

        let response = await fetch(apiUrl, { headers });

        // ✅ Check for errors before proceeding
        if (!response.ok) {
            let errorText = await response.text();
            console.error("⚠️ API Error:", response.status, errorText);
            return m.reply(`⚠️ API Error - Status: ${response.status}\n${errorText}`);
        }

        let imageBuffer = await response.buffer();

        // ✅ Send image to WhatsApp
        await context.client.sendMessage(m.chat, { image: imageBuffer, caption: "🖼️ Here is your AI-generated image!" });

    } catch (error) {
        console.error("AI Image Generation Error:", error);
        m.reply("⚠️ *Failed to fetch AI image.*\nPlease try again later.");
    }
};
