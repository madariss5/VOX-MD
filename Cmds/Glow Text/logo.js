const axios = require("axios");

module.exports = async (context) => {
    const { client, m, text } = context;

    // Define valid styles
    const validStyles = [
        "glitchtext", "neonglitch", "writetext", "advancedglow", "typographytext",
        "pixelglitch", "flagtext", "flag3dtext", "deletingtext", "blackpinkstyle",
        "glowingtext", "underwatertext", "logomaker", "cartoonstyle", "papercutstyle",
        "watercolortext", "effectclouds", "blackpinklogo"
    ];

    // Check if user typed ".logo" (must be checked before regex)
    if (text.trim() === ".logo") {
        const logoMenu = `🖼️ *Choose a logo style:*\n
1️⃣ *glitchtext*\n2️⃣ *neonglitch*\n3️⃣ *writetext*\n4️⃣ *advancedglow*\n5️⃣ *typographytext*\n6️⃣ *pixelglitch*\n7️⃣ *flagtext*\n8️⃣ *flag3dtext*\n9️⃣ *deletingtext*\n🔟 *blackpinkstyle*\n
1️⃣1️⃣ *glowingtext*\n1️⃣2️⃣ *underwatertext*\n1️⃣3️⃣ *logomaker*\n1️⃣4️⃣ *cartoonstyle*\n1️⃣5️⃣ *papercutstyle*\n1️⃣6️⃣ *watercolortext*\n1️⃣7️⃣ *effectclouds*\n1️⃣8️⃣ *blackpinklogo*\n\n
*Example usage:* \`.glitchtext HelloWorld\` or \`.neonglitch YourText\``;

        return m.reply(logoMenu);
    }

    // Match the logo command pattern: `.style YourText`
    const styleMatch = text.match(/^\.([a-zA-Z]+)\s+(.+)$/);

    if (!styleMatch) {
        return m.reply("❌ *Invalid command!*\nUse `.logo` to view available styles.");
    }

    const style = styleMatch[1].toLowerCase(); // Extract style name
    const userText = styleMatch[2].trim(); // Extract user text and trim spaces

    // Validate the style
    if (!validStyles.includes(style)) {
        return m.reply("❌ *Invalid logo style.*\nUse `.logo` to see available styles.");
    }

    try {
        // Notify user
        await client.sendMessage(m.chat, {
            text: "🎨 *Generating your logo... Please wait!* ⏳"
        });

        // Construct API URL
        const apiUrl = `https://fastrestapis.fasturl.cloud/maker/ephoto360?text=${encodeURIComponent(userText)}&style=${style}`;

        // Send the generated logo image
        await client.sendMessage(
            m.chat,
            {
                image: { url: apiUrl },
                caption: `🖼️ *Here is your generated logo for:* _${userText}_`,
            },
            { quoted: m }
        );
    } catch (error) {
        m.reply("❌ *Failed to generate the logo! Please try again later.*");
    }
};