const middleware = require('../../utility/botUtil/middleware');

module.exports = async (context) => {
    await middleware(context, async () => {
        try {
            if (!context || !context.client || !context.m) {
                console.error('❌ Context is undefined or missing client/m');
                return;
            }

            const { client, m } = context;

            if (!m.isGroup) {
                return await client.sendMessage(m.chat, { text: '❌ This command only works in groups!' }, { quoted: m });
            }

            if (!m.isBotAdmin) {
                return await client.sendMessage(m.chat, { text: '⚠️ I need to be an *admin* to fetch the group link!' }, { quoted: m });
            }

            let groupCode = await client.groupInviteCode(m.chat);
            let groupLink = `🔗 *Group Invite Link:*\nhttps://chat.whatsapp.com/${groupCode}`;

            await client.sendMessage(m.chat, { text: groupLink }, { quoted: m, detectLink: true });

        } catch (error) {
            console.error('❌ Error fetching group link:', error);
            await context.client.sendMessage(context.m.chat, { text: '❌ Failed to fetch group link. Make sure I am an admin.' }, { quoted: context.m });
        }
    });
};
