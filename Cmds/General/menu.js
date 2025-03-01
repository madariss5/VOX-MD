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

        // Get a random image from Voxmdgall
        const getRandomImage = () => {
            const assetsPath = path.join(__dirname, '../../Voxmdgall'); // Fixed path
            if (!fs.existsSync(assetsPath)) throw new Error("🚫 Voxmdgall folder not found!");

            const images = fs.readdirSync(assetsPath).filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));
            if (images.length === 0) throw new Error("🚫 No images found in Voxmdgall!");

            return path.join(assetsPath, images[Math.floor(Math.random() * images.length)]);
        };

        // Get the menu voice audio
        const getMenuVoice = () => {
            const voicePath = path.join(__dirname, '../../Voxmdgall/Voxb/menu.mp3'); // Fixed path
            if (!fs.existsSync(voicePath)) throw new Error("🚫 Menu voice file not found!");
            return voicePath;
        };

        // Generate greeting based on time
        const getGreeting = () => {
            const currentHour = DateTime.now().setZone('Africa/Nairobi').hour;
            if (currentHour >= 5 && currentHour < 12) return 'Good morning 🌄';
            if (currentHour >= 12 && currentHour < 18) return 'Good afternoon ☀️';
            if (currentHour >= 18 && currentHour < 22) return 'Good evening 🌆';
            return 'Good night 😴';
        };

        const getCurrentTimeInNairobi = () => {
            return DateTime.now().setZone('Africa/Nairobi').toLocaleString(DateTime.TIME_SIMPLE);
        };

        let menuText = `🎮 *Hello, ${getGreeting()}!* 🎮\n\n`;
        menuText += `👥 𝑼𝑺𝑬𝑹: ${m.pushName}\n`;
        menuText += `👤 𝑩𝑶𝑻𝑵𝑨𝑴𝑬: ${botname}\n`;
        menuText += `📝 𝑪𝑶𝑴𝑴𝑨𝑵𝑫𝑺: ${totalCommands}\n`;
        menuText += `🕝 𝑻𝑰𝑴𝑬: ${getCurrentTimeInNairobi()}\n`;
        menuText += `✍️ 𝑷𝑹𝑬𝑭𝑰𝑿: ${prefix}\n`;
        menuText += `🔓 𝑴𝑶𝑫𝑬: ${mode}\n`;
        menuText += `💡 𝑳𝑰𝑩𝑹𝑨𝑹𝒀: Baileys\n`;
        menuText += '━━━━━━━━━━━━━━\n\n';

        // Convert text to fancy fonts
        const toFancyUppercaseFont = (text) => {
            const fonts = { 'A': '𝐀', 'B': '𝐁', 'C': '𝐂', 'D': '𝐃', 'E': '𝐄', 'F': '𝐅', 'G': '𝐆', 'H': '𝐇', 'I': '𝐈', 'J': '𝐉', 'K': '𝐊', 'L': '𝐋', 'M': '𝐌',
                'N': '𝐍', 'O': '𝐎', 'P': '𝐏', 'Q': '𝐐', 'R': '𝐑', 'S': '𝐒', 'T': '𝐓', 'U': '𝐔', 'V': '𝐕', 'W': '𝐖', 'X': '𝐗', 'Y': '𝐘', 'Z': '𝐙' };
            return text.split('').map(char => fonts[char] || char).join('');
        };

        const toFancyLowercaseFont = (text) => {
            const fonts = { 'a': '𝑎', 'b': '𝑏', 'c': '𝑐', 'd': '𝑑', 'e': '𝑒', 'f': '𝑓', 'g': '𝑔', 'h': 'ℎ', 'i': '𝑖', 'j': '𝑗', 'k': '𝑘', 'l': '𝑙', 'm': '𝑚',
                'n': '𝑛', 'o': '𝑜', 'p': '𝑝', 'q': '𝑞', 'r': '𝑟', 's': '𝑠', 't': '𝑡', 'u': '𝑢', 'v': '𝑣', 'w': '𝑤', 'x': '𝑥', 'y': '𝑦', 'z': '𝑧' };
            return text.split('').map(char => fonts[char] || char).join('');
        };

        // Add command categories
        for (const category of categories) {
            const categoryPath = path.join(__dirname, `../${category.name}`);
            if (!fs.existsSync(categoryPath)) continue;

            const commandFiles = fs.readdirSync(categoryPath).filter(file => file.endsWith('.js'));

            const fancyCategory = toFancyUppercaseFont(category.name.toUpperCase());
            menuText += `*${fancyCategory} ${category.emoji}:* \n`;

            for (const file of commandFiles) {
                const commandName = file.replace('.js', '');
                const fancyCommandName = toFancyLowercaseFont(commandName);
                menuText += `  💎 ${fancyCommandName}\n`;
            }

            menuText += '\n';
        }

        menuText += `\n🌟 𝗣𝗼𝘄𝗲𝗿𝗲𝗱 𝗯𝘆: @ 𝗩𝗢𝗫𝗡𝗘𝗧.𝗜𝗡𝗖.\n`;

        const imageBuffer = fs.readFileSync(getRandomImage());
        const voiceBuffer = fs.readFileSync(getMenuVoice());

        // Send menu image
        await client.sendMessage(m.chat, {
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
                    renderLargerThumbnail: true
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
