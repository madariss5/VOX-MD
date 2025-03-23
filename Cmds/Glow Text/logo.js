const axios = require("axios");

module.exports = async (context) => {
    const { client, m, text } = context;

    // Step 1: If the user enters '.logo', show the logo selection menu
    if (text === '.logo') {
        const logoMenu = `🖼️ *Choose a logo style:*\n
1️⃣ glitchtext\n2️⃣ neonglitch\n3️⃣ writetext\n4️⃣ advancedglow\n5️⃣ typographytext\n6️⃣ pixelglitch\n7️⃣ flagtext\n8️⃣ flag3dtext\n9️⃣ deletingtext\n🔟 blackpinkstyle\n1️⃣1️⃣ glowingtext\n1️⃣2️⃣ underwatertext\n1️⃣3️⃣ logomaker\n1️⃣4️⃣ cartoonstyle\n1️⃣5️⃣ papercutstyle\n1️⃣6️⃣ watercolortext\n1️⃣7️⃣ effectclouds\n1️⃣8️⃣ blackpinklogo\n\n*Example usage:* .glitchtext VOXMD!`;

        return m.reply(logoMenu);
    }

    // Step 2: Generate the logo based on user selection and text
    if (text.startsWith('.')) {
        const logoType = text.split(' ')[0].substring(1); // Get the logo type, e.g., 'glitchtext'
        const userText = text.split(' ').slice(1).join(' '); // Get the text after the logo type, e.g., 'VOXMD!'

        if (!userText) {
            return m.reply("❌ *Please provide text for the logo!*\n\nExample usage:\n`.glitchtext VOXMD!`");
        }

        try {
            // Notify user that the process has started
            await client.sendMessage(m.chat, { 
                text: "🎨 *Generating your logo... Please wait!* ⏳" 
            });

            const apiUrl = `https://fastrestapis.fasturl.cloud/maker/ephoto360?text=${encodeURIComponent(userText)}&style=${logoType}`;

            // Send the generated logo
            await client.sendMessage(
                m.chat,
                {
                    image: { url: apiUrl },
                    caption: `🖼️ *Here is your generated logo for:* _${userText}_`,
                },
                { quoted: m }
            );
        } catch (error) {
            console.error("Logo generation error:", error.message);
            m.reply("❌ *Failed to generate the logo! Please try again later.*");
        }
    } else {
        // If the text is neither '.logo' nor a valid logo style, prompt for a valid command
        return m.reply("❌ *Invalid command!*\nUse `.logo` to view the logo styles.");
    }
};