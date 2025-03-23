const axios = require("axios");

module.exports = async (context) => {
    const { client, m, text } = context;

    // Step 1: Handle when the user types ".logo"
    if (text === ".logo") {
        const logoMenu = `🖼️ *Choose a logo style:*\n
1️⃣ *glitchtext*\n2️⃣ *neonglitch*\n3️⃣ *writetext*\n4️⃣ *advancedglow*\n5️⃣ *typographytext*\n6️⃣ *pixelglitch*\n7️⃣ *flagtext*\n8️⃣ *flag3dtext*\n9️⃣ *deletingtext*\n🔟 *blackpinkstyle*\n
1️⃣1️⃣ *glowingtext*\n1️⃣2️⃣ *underwatertext*\n1️⃣3️⃣ *logomaker*\n1️⃣4️⃣ *cartoonstyle*\n1️⃣5️⃣ *papercutstyle*\n1️⃣6️⃣ *watercolortext*\n1️⃣7️⃣ *effectclouds*\n1️⃣8️⃣ *blackpinklogo*\n\n
*Example usage:* \`.glitchtext HelloWorld\` or \`.neonglitch YourText\``;

        return m.reply(logoMenu); // Send the list of logos available
    }

    // Step 2: Define valid styles
    const validStyles = [
        "glitchtext", "neonglitch", "writetext", "advancedglow", "typographytext",
        "pixelglitch", "flagtext", "flag3dtext", "deletingtext", "blackpinkstyle",
        "glowingtext", "underwatertext", "logomaker", "cartoonstyle", "papercutstyle",
        "watercolortext", "effectclouds", "blackpinklogo"
    ];

    // Step 3: Check if the user entered a valid logo style command
    const styleMatch = text.match(/^\.([a-zA-Z]+)\s+(.*)$/); // Match: .style YourText

    if (styleMatch) {
        const style = styleMatch[1].toLowerCase(); // Extract style name
        const userText = styleMatch[2] ? styleMatch[2].trim() : ""; // Prevent undefined error

        // Check if style is valid
        if (!validStyles.includes(style)) {
            return m.reply("❌ *Invalid logo style.*\nUse `.logo` to see available styles.");
        }

        // Ensure user provided text
        if (!userText) {
            return m.reply("❌ *Please provide text for your logo!*\nExample: `.glitchtext Hello`");
        }

        try {
            // Notify user that the process has started
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
    } else {
        return m.reply("❌ *Invalid command!*\nUse `.logo` to view available styles.");
    }
};