module.exports = async (context) => {
    const { client, m, dreadedspeed } = context;

    try {
        // Fetch battery status from Baileys event data
        let batteryLevel = "Unknown";
        let isCharging = "🔋 Not Charging";

        if (client.battery) {
            batteryLevel = `${client.battery.value || "Unknown"}%`;
            isCharging = client.battery.charging ? "⚡ Charging" : "🔋 Not Charging";
        }

        // Fetch device info from user session
        let phoneModel = "Unknown";
        let platform = "Unknown";

        if (client.user) {
            phoneModel = client.user.phone?.device_model || "Unknown";
            platform = client.user.phone?.os_version || "Unknown";
        }

        // Construct the response message
        let response = `*📶 Pong!*\n⏱️ *Speed:* ${dreadedspeed.toFixed(4)}ms\n`;
        response += `🔋 *Battery:* ${batteryLevel} (${isCharging})\n`;
        response += `📱 *Phone Model:* ${phoneModel}\n`;
        response += `🛠️ *OS Platform:* ${platform}\n`;

        await m.reply(response);
    } catch (error) {
        console.error("Error executing ping:", error);
        await m.reply("❌ Error fetching device info.");
    }
};