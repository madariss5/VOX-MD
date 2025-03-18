const axios = require("axios");

const logoAPI = {
    1: "https://en.ephoto360.com/create-a-blackpink-style-logo-with-members-signatures-810.html",
    2: "https://en.ephoto360.com/online-blackpink-style-logo-maker-effect-711.html",
    3: "https://en.ephoto360.com/create-glossy-silver-3d-text-effect-online-802.html",
    4: "https://en.ephoto360.com/naruto-shippuden-logo-style-text-effect-online-808.html",
    5: "https://en.ephoto360.com/create-digital-glitch-text-effects-online-767.html",
    6: "https://en.ephoto360.com/create-pixel-glitch-text-effect-online-769.html",
    7: "https://en.ephoto360.com/create-online-3d-comic-style-text-effects-817.html",
    8: "https://en.ephoto360.com/create-colorful-neon-light-text-effects-online-797.html",
    9: "https://en.ephoto360.com/free-bear-logo-maker-online-673.html",
    10: "https://en.ephoto360.com/neon-devil-wings-text-effect-online-683.html",
    11: "https://en.ephoto360.com/create-sad-girl-logo-online-679.html",
    12: "https://en.ephoto360.com/create-beautiful-leaves-text-effect-744.html",
    13: "https://en.ephoto360.com/create-dragon-ball-logo-style-text-effect-809.html",
    14: "https://en.ephoto360.com/handwritten-text-effect-3d-style-745.html",
    15: "https://en.ephoto360.com/neon-light-logo-maker-online-657.html",
    16: "https://en.ephoto360.com/3d-castle-pop-text-effect-online-787.html",
    17: "https://en.ephoto360.com/frozen-christmas-text-effect-online-725.html",
    18: "https://en.ephoto360.com/3d-foil-balloons-text-effect-online-754.html",
    19: "https://en.ephoto360.com/3d-colourful-paint-text-effect-online-777.html",
    20: "https://en.ephoto360.com/american-flag-3d-text-effect-online-703.html",
};

module.exports = async (context) => {
    const { client, m, args } = context;

    try {
        if (!args[0]) {
            return m.reply("*_Please provide text for the logo. Example: .logo Kanambo_*");
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

            let apiUrl = `https://api-pink-venom.vercel.app/api/logo?url=${encodeURIComponent(logoAPI[choice])}&name=${encodeURIComponent(text)}`;

            try {
                let response = await axios.get(apiUrl);
                let logoUrl = response.data.result.download_url;

                await client.sendMessage(m.chat, { image: { url: logoUrl }, caption: `✅ *Here is your ${choice} style logo!*` }, { quoted: msg });
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