const axios = require("axios");

const logoAPI = {
    1: "https://textpro.me/create-blackpink-style-logo-online-1001.html",
    2: "https://textpro.me/create-blackpink-2-style-logo-1025.html",
    3: "https://textpro.me/create-3d-silver-text-effect-1030.html",
    4: "https://textpro.me/create-naruto-logo-style-text-online-1017.html",
    5: "https://textpro.me/create-digital-glitch-text-effect-1032.html",
    6: "https://textpro.me/create-pixel-glitch-text-effect-online-1016.html",
    7: "https://textpro.me/create-comic-style-text-effect-1039.html",
    8: "https://textpro.me/create-neon-light-text-effect-online-1018.html",
    9: "https://textpro.me/create-free-bear-logo-online-1033.html",
    10: "https://textpro.me/create-devil-wings-logo-online-1027.html",
    11: "https://textpro.me/create-sad-girl-text-effect-1034.html",
    12: "https://textpro.me/create-leaves-text-effect-online-1019.html",
    13: "https://textpro.me/create-dragon-ball-text-effect-online-1020.html",
    14: "https://textpro.me/create-hand-written-text-effect-1022.html",
    15: "https://textpro.me/create-neon-light-glow-text-effect-1031.html",
    16: "https://textpro.me/create-3d-castle-pop-text-effect-1028.html",
    17: "https://textpro.me/create-frozen-christmas-text-effect-1026.html",
    18: "https://textpro.me/create-3d-foil-balloons-text-effect-1029.html",
    19: "https://textpro.me/create-3d-colorful-paint-text-effect-1024.html",
    20: "https://textpro.me/create-american-flag-3d-text-effect-1013.html",
};

module.exports = async (context) => {
    const { client, m, args } = context;

    try {
        if (!args[0]) {
            return m.reply("*_Please provide text for the logo._*");
        }

        let text = args.join(" ");
        let logomenu = `*🤍 💎 Logo Maker 💎*\n\n`
            + `*◈ Text:* ${text}\n`
            + `╼──────────────╾\n`
            + `🔢 Reply with a number to choose your style:\n\n`
            + `1️⃣ ➠ Black Pink\n`
            + `2️⃣ ➠ Black Pink 2\n`
            + `3️⃣ ➠ Silver 3D\n`
            + `4️⃣ ➠ Naruto\n`
            + `5️⃣ ➠ Digital Glitch\n`
            + `6️⃣ ➠ Pixel Glitch\n`
            + `7️⃣ ➠ Comic Style\n`
            + `8️⃣ ➠ Neon Light\n`
            + `9️⃣ ➠ Free Bear\n`
            + `🔟 ➠ Devil Wings\n`
            + `1️⃣1️⃣ ➠ Sad Girl\n`
            + `1️⃣2️⃣ ➠ Leaves\n`
            + `1️⃣3️⃣ ➠ Dragon Ball\n`
            + `1️⃣4️⃣ ➠ Hand Written\n`
            + `1️⃣5️⃣ ➠ Neon Glow\n`
            + `1️⃣6️⃣ ➠ 3D Castle Pop\n`
            + `1️⃣7️⃣ ➠ Frozen Christmas\n`
            + `1️⃣8️⃣ ➠ 3D Foil Balloons\n`
            + `1️⃣9️⃣ ➠ 3D Colorful Paint\n`
            + `2️⃣0️⃣ ➠ American Flag 3D\n\n`
            + `> *©💎 Logo Generator 💎*`;

        await client.sendMessage(m.chat, { text: logomenu }, { quoted: m });

        // Wait for user reply
        client.once("message", async (msg) => {
            let choice = parseInt(msg.body.trim());
            if (!logoAPI[choice]) return msg.reply("❌ Invalid option! Please choose a number from the list.");

            let apiUrl = `https://api.example.com/logo?text=${encodeURIComponent(text)}&style=${encodeURIComponent(logoAPI[choice])}`;

            try {
                let response = await axios.get(apiUrl, { responseType: "arraybuffer" });
                let logoBuffer = Buffer.from(response.data, "binary");

                await client.sendMessage(m.chat, { image: logoBuffer, caption: `✅ *Here is your ${choice} style logo!*` }, { quoted: msg });
            } catch (error) {
                console.error(error);
                msg.reply("⚠️ Error generating the logo. Please try again later.");
            }
        });

    } catch (err) {
        console.error(err);
        m.reply("*An error occurred while processing your request. Please try again later!*");
    }
};