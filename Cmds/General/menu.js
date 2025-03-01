const { DateTime } = require("luxon");
const fs = require("fs");
const path = require("path");

module.exports = async (context) => {
    const { client, m, totalCommands, mode, botname, prefix } = context;

    try {
        const categories = [
            { name: "AI", emoji: "🤖" },
            { name: "General", emoji: "✍️" },
            { name: "Media", emoji: "🎥" },
            { name: "Search", emoji: "🔍" },
            { name: "Editting", emoji: "✂️" },
            { name: "Groups", emoji: "👥" },
            { name: "Owner", emoji: "👑" },
            { name: "Coding", emoji: "💻" },
            { name: "Utils", emoji: "🎭" },
        ];

        // Function to fetch a random image from ./Voxmdgall
        const getRandomImage = () => {
            const assetsPath = path.join(__dirname, "../Voxmdgall");
            const images = fs.readdirSync(assetsPath).filter((file) => /\.(jpg|jpeg|png|gif)$/i.test(file));

            if (images.length === 0) throw new Error("🚫 No images found in Voxmdgall folder!");
            return path.join(assetsPath, images[Math.floor(Math.random() * images.length)]);
        };

        // Function to get the menu audio
        const getMenuVoice = () => {
            const voicePath = path.join(__dirname, "../Voxmdgall/Voxb/menu.mp3");
            if (!fs.existsSync(voicePath)) throw new Error("🚫 Menu voice file not found!");
            return voicePath;
        };

        // Function to generate greetings based on time
        const getGreeting = () => {
            const hour = DateTime.now().setZone("Africa/Nairobi").hour;
            if (hour >= 5 && hour < 12) return "🌅 𝗚𝗼𝗼𝗱 𝗠𝗼𝗿𝗻𝗶𝗻𝗴";
            if (hour >= 12 && hour < 18) return "☀️ 𝗚𝗼𝗼𝗱 𝗔𝗳𝘁𝗲𝗿𝗻𝗼𝗼𝗻";
            if (hour >= 18 && hour < 22) return "🌆 𝗚𝗼𝗼𝗱 𝗘𝘃𝗲𝗻𝗶𝗻𝗴";
            return "🌙 𝗚𝗼𝗼𝗱 𝗡𝗶𝗴𝗵𝘁";
        };

        const currentTime = DateTime.now().setZone("Africa/Nairobi").toLocaleString(DateTime.TIME_SIMPLE);

        // ✨ Stylish Header Section
        let menuText = `🎮 *Hello, ${getGreeting()}!* 🎮\n\n`;
        menuText += `👤 𝗨𝘀𝗲𝗿: ${m.pushName}\n`;
        menuText += `🤖 𝗕𝗼𝘁: ${botname}\n`;
        menuText += `📝 𝗖𝗼𝗺𝗺𝗮𝗻𝗱𝘀: ${totalCommands}\n`;
        menuText += `⏰ 𝗧𝗶𝗺𝗲: ${currentTime}\n`;
        menuText += `🔖 𝗣𝗿𝗲𝗳𝗶𝘅: ${prefix}\n`;
        menuText += `🔓 𝗠𝗼𝗱𝗲: ${mode}\n`;
        menuText += `📚 𝗟𝗶𝗯𝗿𝗮𝗿𝘆: Baileys\n`;
        menuText += `━━━━━━━━━━━━━━\n\n`;

        // Convert text into **Fancy Font Styles**
        const toFancyUppercase = (text) =>
            text.replace(/[A-Z]/g, (c) => "𝐀𝐁𝐂𝐃𝐄𝐅𝐆𝐇𝐈𝐉𝐊𝐋𝐌𝐍𝐎𝐏𝐐𝐑𝐒𝐓𝐔𝐕𝐖𝐗𝐘𝐙"[c.charCodeAt(0) - 65]);

        const toFancyLowercase = (text) =>
            text.replace(/[a-z]/g, (c) => "𝑎𝑏𝑐𝑑𝑒𝑓𝑔ℎ𝑖𝑗𝑘𝑙𝑚𝑛𝑜𝑝𝑞𝑟𝑠𝑡𝑢𝑣𝑤𝑥𝑦𝑧"[c.charCodeAt(0) - 97]);

        // 🏆 Command List with Categories
        for (const category of categories) {
            const commandFiles = fs.readdirSync(`./Cmds/${category.name}`).filter((file) => file.endsWith(".js"));

            menuText += `📂 *${toFancyUppercase(category.name)} ${category.emoji}:* \n`;
            for (const file of commandFiles) {
                menuText += `   💎 ${toFancyLowercase(file.replace(".js", ""))}\n`;
            }
            menuText += `━━━━━━━━━━━━━━\n\n`;
        }

        // 🌟 Stylish Footer
        menuText += `⚡ 𝗣𝗼𝘄𝗲𝗿𝗲𝗱 𝗯𝘆: @ 𝗩𝗢𝗫𝗡𝗘𝗧.𝗜𝗡𝗖.\n`;

        const imageBuffer = fs.readFileSync(getRandomImage());
        const voiceBuffer = fs.readFileSync(getMenuVoice());

        // 🎨 Send Stylish Menu with Thumbnail & Caption
        await client.sendMessage(
            m.chat,
            {
                image: imageBuffer,
                caption: menuText,
                jpegThumbnail: imageBuffer,
                contextInfo: {
                    externalAdReply: {
                        showAdAttribution: false,
                        title: `KANAMBO`,
                        body: `Hi ${m.pushName}`,
                        thumbnail: imageBuffer,
                        sourceUrl: `https://github.com/Kanambp/dreaded-v2`,
                        mediaType: 1,
                        renderLargerThumbnail: true,
                    },
                },
            },
            { quoted: m }
        );

        // 🔊 Send Menu Voice
        await client.sendMessage(
            m.chat,
            {
                audio: voiceBuffer,
                mimetype: "audio/mpeg",
                ptt: true,
            },
            { quoted: m }
        );
    } catch (error) {
        console.error(error);
        m.reply("❌ An error occurred while fetching the menu.");
    }
};
