module.exports = async (context) => {
    const { client, m, dreadedspeed } = context;

    try {
        // Fetch battery percentage from Baileys
        let batteryStatus = client?.battery || { value: "Unknown", charging: false };
        let batteryLevel = batteryStatus.value !== undefined ? `${batteryStatus.value}%` : "Unknown";
        let isCharging = batteryStatus.charging ? "⚡ Charging" : "🔋 Not Charging";

        // Extract device info (Baileys usually provides some device metadata)
        const phoneInfo = client?.user || {}; 
        const { phone, platform } = phoneInfo;
        
        // Construct the response message
        let response = `*📶 Pong!*\n⏱️ *Speed:* ${dreadedspeed.toFixed(4)}ms\n`;
        response += `🔋 *Battery:* ${batteryLevel} (${isCharging})\n`;
        response += `📱 *Phone Model:* ${phone?.device_model || "Unknown"}\n`;
        response += `🛠️ *OS Platform:* ${platform || "Unknown"}\n`;
        response += `💾 *RAM & Storage:* Unavailable (Baileys does not provide this data)\n`;

        await m.reply(response);
    } catch (error) {
        console.error("Error executing ping:", error);
        await m.reply("❌ Error fetching device info.");
    }
};