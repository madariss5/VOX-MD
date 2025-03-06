module.exports = async (context) => {
    const { client, m, prefix } = context;

    const creditsText = `╭━━━〔 *VOX-MD CREDITS* 〕━━━⬣
┃  
┃ 🚀 *Special Thanks & Acknowledgments*  
┃━━━━━━━━━━━━━━━━━━━⬣
┃ 👑 *Kanambo* ➪ *Owner & Developer*  
┃ 🖇️ *Owner repo too*: (https://github.com/Kanambp)
┃ 🔗 [VOX-MD Repository](https://github.com/Vox-Net/VOX-MD)
┃  
┃ 🛠️ *Dika Ardnt* ➪ *Indonesia*  
┃ ✨ Base Code (Case Method)  
┃ 🔗 [GitHub](https://github.com/DikaArdnt)
┃  
┃ ⚙️ *Adiwajshing* ➪ *India*  
┃ 📚 Baileys Library Creator  
┃ 🔗 [GitHub](https://github.com/WhiskeySockets/Baileys)
┃  
┃ 🌀 *WAWebSockets Discord Community*  
┃ 🔍 Web Sockets Reverse Engineering  
┃ 🔗 [Discord](https://discord.gg/WeJM5FP9GG)
┃  
┃ 🔥 *Fortunatus Mokaya* ➪ *Kenya*  
┃ 🛠️ Debugging & Compilation  
┃ 🔗 [GitHub](https://github.com/Fortunatusmokaya)
┃  
┃ 🐉 *Malik* ➪ *Kenya*  
┃ 🔬 Decompiling & Fixes  
┃ 🔗 [GitHub](https://github.com/darkLo1rd)
┃  
┃ 🤖 *ChatGPT (AI Assistant)*  
┃ 💡 Debugging & Enhancements  
┃ 🔗 [OpenAI](https://chat.openai.com)
┃  
╰━━━━━━━━━━━━━━━━━━━⬣

╭━━〔 *Powered by ©VOXNET.INC* 〕━━⬣  
┃ 🤖 *BOT NAME* ➪ *VOX-MD*  
┃ 👑 *AUTHOR / DEV / OWNER* ➪ *KANAMBO*  
╰━━━━━━━━━━━━━━━━━━━⬣`;

    await client.sendMessage(m.chat, { text: creditsText });
}
