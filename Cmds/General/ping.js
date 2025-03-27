const axios = require("axios");

module.exports = async (context) => {
    const { client, m, dreadedspeed } = context;

    try {
        // Fetch battery status from Baileys
        let batteryLevel = "Unknown";
        let isCharging = "🔋 Not Charging";

        if (client.battery) {
            batteryLevel = client.battery.value ? `${client.battery.value}%` : "Unknown";
            isCharging = client.battery.charging ? "⚡ Charging" : "🔋 Not Charging";
        }

        // Fetch device info from user session
        let phoneModel = "Unknown";
        let platform = "Unknown";

        if (client.user) {
            phoneModel = client.user.phone?.device_model || "Unknown";
            platform = client.user.phone?.os_version || "Unknown";
        }

        // Fetch IP Address, Country, and Region
        let ipAddress = "Unable to fetch";
        let country = "Unknown";
        let region = "Unknown";

        try {
            const ipResponse = await axios.get("https://api64.ipify.org?format=json");
            ipAddress = ipResponse.data.ip;

            const locationResponse = await axios.get("https://ipinfo.io/json");
            country = locationResponse.data.country || "Unknown";
            region = locationResponse.data.region || "Unknown";
        } catch (error) {
            console.error("Error fetching IP/Location:", error);
        }

        // Construct the response message
        let response = `*📶 Pong!*\n⏱️ *Speed:* ${dreadedspeed.toFixed(4)}ms\n`;
        response += `🔋 *Battery:* ${batteryLevel} (${isCharging})\n`;
        response += `📱 *Phone Model:* ${phoneModel}\n`;
        response += `🛠️ *OS Platform:* ${platform}\n`;
        response += `🌍 *IP Address:* ${ipAddress}\n`;
        response += `🏳 *Country:* ${country}\n`;
        response += `📍 *Region:* ${region}\n`;

        await m.reply(response);
    } catch (error) {
        console.error("Error executing ping:", error);
        await m.reply("❌ Error fetching device info.");
    }
};