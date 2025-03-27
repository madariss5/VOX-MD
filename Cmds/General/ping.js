const axios = require("axios");

module.exports = async (context) => {
    const { client, m, dreadedspeed } = context;

    try {
        // Fetch battery status
        let batteryLevel = "Unknown";
        let isCharging = "🔋 Not Charging";

        if (client.battery) {
            batteryLevel = client.battery.value ? `${client.battery.value}%` : "Unknown";
            isCharging = client.battery.charging ? "⚡ Charging" : "🔋 Not Charging";
        }

        // Fetch device info
        let phoneModel = "Unknown";
        let platform = "Unknown";

        if (client.user) {
            phoneModel = client.user.phone?.device_model || "Unknown";
            platform = client.user.phone?.os_version || "Unknown";
        }

        // Get the user's phone number country code
        let userNumber = m.key.remoteJid.split("@")[0]; // Extracts the phone number
        let countryCode = userNumber.substring(0, userNumber.length - 9); // Extracts country code
        let country = "Unknown";

        // Fetch country name based on phone number country code
        try {
            const countryResponse = await axios.get(`https://restcountries.com/v3.1/all`);
            let countryData = countryResponse.data.find((c) => c.idd?.root && userNumber.startsWith(c.idd.root));
            if (countryData) {
                country = countryData.name.common;
            }
        } catch (error) {
            console.error("Error fetching country:", error);
        }

        // Construct response
        let response = `*📶 Pong!*\n⏱️ *Speed:* ${dreadedspeed.toFixed(4)}ms\n`;
        response += `🔋 *Battery:* ${batteryLevel} (${isCharging})\n`;
        response += `📱 *Phone Model:* ${phoneModel}\n`;
        response += `🛠️ *OS Platform:* ${platform}\n`;
        response += `🏳 *Country:* ${country} (Based on phone number code)\n`;

        await m.reply(response);
    } catch (error) {
        console.error("Error executing ping:", error);
        await m.reply("❌ Error fetching user details.");
    }
};