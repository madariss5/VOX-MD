const { DateTime } = require('luxon');
const fs = require('fs');
const path = require('path');

module.exports = async (context) => {
    const { client, m, totalCommands, mode, botname, prefix } = context;

    try {
        const categories = [
            { name: 'AI', emoji: '🤖' },
            { name: 'General', emoji: '✍️' },
            { name: 'Media', emoji: '🎥' },
            { name: 'Search', emoji: '🔍' },
            { name: 'Editting', emoji: '✂️' },
            { name: 'Groups', emoji: '👥' },
            { name: 'Owner', emoji: '👑' },
            { name: 'Coding', emoji: '💻' },
            { name: 'Utils', emoji: '🎭' }
        ];

        // WhatsApp Group Link
        const groupLink = "https://chat.whatsapp.com/JXIs0m622UHJtN1HoXSnQ3";

        // Get a random image from Voxmdgall
        const getRandomThumbnail = () => {
            const assetsPath = path.join(__dirname, '../../Voxmdgall'); 
            if (!fs.existsSync(assetsPath)) throw new Error("🚫 Voxmdgall folder not found!");

            const images = fs.readdirSync(assetsPath).filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));
            if (images.length === 0) throw new Error("🚫 No images found in Voxmdgall!");

            const randomImage = images[Math.floor(Math.random() * images.length)];
            return fs.readFileSync(path.join(assetsPath, randomImage)); // Return image buffer
        };

        // Get menu voice
        const getMenuVoice = () => {
            const voicePath = path.join(__dirname, '../../Voxmdgall/Voxb/menu.mp3'); 
            if (!fs.existsSync(voicePath)) throw new Error("🚫 Menu voice file not found!");
            return fs.readFileSync(voicePath);
        };

        // Generate greeting
        const getGreeting = () => {
            const currentHour = DateTime.now().setZone('Africa/Nairobi').hour;
            if (currentHour >= 5 && currentHour < 12) return '🌄 Good morning';
            if (currentHour >= 12 && currentHour < 18) return '☀️ Good afternoon';
            if (currentHour >= 18 && currentHour < 22) return '🌆 Good evening';
            return '🌙 Good night';
        };

        const getCurrentTimeInNairobi = () => {
            return DateTime.now().setZone('Africa/Nairobi').toLocaleString(DateTime.TIME_SIMPLE);
        };

        // Stylish Menu Text with Read More
        let menuText = `╔════ ⟡ *VOX-MD* ⟡ ════╗\n`;
        menuText += `       *🎮 𝑾𝑬𝑳𝑪𝑶𝑴𝑬 🎮*\n`;
        menuText += `╚═════════════════╝\n`;
        menuText += `👤 *𝑼𝑺𝑬𝑹:* ${m.pushName}\n`;
        menuText += `🤖 *𝑩𝑶𝑻:* ${botname}\n`;
        menuText += `📝 *𝑪𝑶𝑴𝑴𝑨𝑵𝑫𝑺:* ${totalCommands}\n`;
        menuText += `🕒 *𝑻𝑰𝑴𝑬:* ${getCurrentTimeInNairobi()}\n`;
        menuText += `✍️ *𝑷𝑹𝑬𝑭𝑰𝑿:* ${prefix}\n`;
        menuText += `🔓 *𝑴𝑶𝑫𝑬:* ${mode}\n`;
        menuText += `📚 *𝑳𝑰𝑩𝑹𝑨𝒓𝒀:* Baileys\n`;
        menuText += `━━━━━━━━━━━━━━\n`;

        // Add Read More Effect
        menuText += `\n\n\u200B`.repeat(10);

        // Add command categories
        for (const category of categories) {
            const categoryPath = path.join(__dirname, `../${category.name}`);
            if (!fs.existsSync(categoryPath)) continue;

            const commandFiles = fs.readdirSync(categoryPath).filter(file => file.endsWith('.js'));

            menuText += `🌟 *${category.name.toUpperCase()}* ${category.emoji}\n`;
            menuText += `══════════════\n`;

            for (const file of commandFiles) {
                const commandName = file.replace('.js', '');
                menuText += `  ➤ 🔹 *${prefix}${commandName}*\n`;
            }

            menuText += '\n';
        }

        menuText += `⚡ *𝗣𝗢𝗪𝗘𝗥𝗘𝗗 𝗕𝗬:* 𝗩𝗢𝗫𝗡𝗘𝗧.𝗜𝗡𝗖.\n`;
        menuText += `━━━━━━━━━━━━━━\n`;
        menuText += `🌍 *Join Our WhatsApp Group:*\n🔗 ${groupLink}\n`;

        const voiceBuffer = getMenuVoice();
        const thumbnailBuffer = getRandomThumbnail(); // Get random image buffer

        // Send menu with a random image as thumbnail and WhatsApp link as the source URL
        await client.sendMessage(m.chat, {
            image: thumbnailBuffer,
            caption: menuText,
            contextInfo: {
                externalAdReply: {
                    title: "VOX-MD",
                    body: "Click to join our WhatsApp group!",
                    mediaType: 1, // Image
                    thumbnail: thumbnailBuffer,
                    sourceUrl: groupLink // WhatsApp group link in the source URL
                }
            }
        }, { quoted: m });

        // Send menu voice
        await client.sendMessage(m.chat, {
            audio: voiceBuffer,
            mimetype: "audio/mpeg",
            ptt: true,
        }, { quoted: m });

    } catch (error) {
        console.error(error);
        m.reply('❌ An error occurred while fetching the menu.');
    }
};
