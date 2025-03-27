module.exports = async (context) => {
    const { client, m, dreadedspeed } = context;

    // Get device information
    const battery = await client.fetchBatteryStatus(); // Fetch battery percentage
    const phoneInfo = m.deviceInfo || {}; // Get device information
    const { model, manufacturer, os_version, ram, storage } = phoneInfo;

    // Construct response message
    let response = `*📶 Pong!*\n⏱️ *Speed:* ${dreadedspeed.toFixed(4)}ms\n`;

    if (battery) {
        response += `🔋 *Battery:* ${battery.percentage}%\n`;
    }
    if (model) {
        response += `📱 *Phone Model:* ${manufacturer} ${model}\n`;
    }
    if (os_version) {
        response += `🛠️ *OS Version:* ${os_version}\n`;
    }
    if (ram) {
        response += `💾 *RAM:* ${ram}GB\n`;
    }
    if (storage) {
        response += `📂 *Storage (ROM):* ${storage}GB\n`;
    }

    await m.reply(response);
};
