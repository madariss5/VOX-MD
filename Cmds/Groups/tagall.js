const middleware = require('../../utility/botUtil/middleware');

module.exports = async (context) => {
    await middleware(context, async () => {
        const { client, m, args, participants, text } = context;

        // 🏷️ Construct the message dynamically
        let txt = `╭━━〔 🔔 *TAG NOTIFICATION* 🔔 〕━━╮\n\n`;
        txt += `👤 *Sender:* ${m.pushName}\n`;
        txt += `💬 *Message:* ${text ? text : 'No Message!'}\n\n`;
        txt += `📢 *Tagged Members:*\n`;

        // 🏷️ Loop through participants & add mentions
        for (let mem of participants) { 
            txt += `└ 📨 @${mem.id.split('@')[0]}\n`;
        } 

        txt += `\n╰━━━━━━━━━━━━━━━━━━╯`;

        // 📩 Send the formatted message
        client.sendMessage(m.chat, { 
            text: txt, 
            mentions: participants.map(a => a.id) 
        }, { quoted: m }); 
    });
};
