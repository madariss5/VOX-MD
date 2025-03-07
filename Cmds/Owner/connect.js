const fs = require("fs");
const path = require("path");

module.exports = async (context) => {
    const { client, m, text, prefix } = context;

    // Only allow the owner to use this command
    if (m.sender !== "254114148625@s.whatsapp.net") {
        return m.reply("❌ *You are not authorized to use this command!*");
    }

    // Ensure session name and reply exist
    if (!text || !m.quoted || !m.quoted.text) {
        return m.reply(`❌ *Usage:*\n\`${prefix}connect <session_name>\` (Reply with Base64 session)`);
    }

    const sessionName = text.trim();
    const sessionBase64 = m.quoted.text.trim();
    const sessionPath = path.join(__dirname, "../../session", sessionName);

    try {
        // Create session folder if it doesn't exist
        if (!fs.existsSync(sessionPath)) {
            fs.mkdirSync(sessionPath, { recursive: true });
        }

        // Decode and save session
        const sessionData = Buffer.from(sessionBase64, "base64").toString("utf-8");
        fs.writeFileSync(path.join(sessionPath, "creds.json"), sessionData);

        await m.reply(`✅ *Session '${sessionName}' has been connected successfully!*`);
    } catch (error) {
        console.error("❌ Error in connectbot.js:", error);
        await m.reply("❌ *Failed to save session. Please check the Base64 data and try again!*");
    }
};
