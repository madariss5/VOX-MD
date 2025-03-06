const middleware = require('../../utility/botUtil/middleware');

module.exports = async (context) => {
    await middleware(context, async (client, m) => {  // Fix: Pass client & m correctly
        try {
            if (!m.isGroup) {
                return client.sendText(m.chat, '❌ This command only works in groups!', m);
            }

            let response = await client.groupInviteCode(m.chat);
            let link = `🔗 *Group Invite Link:*\nhttps://chat.whatsapp.com/${response}`;

            await client.sendText(m.chat, link, m, { detectLink: true });

        } catch (error) {
            console.error('❌ Error fetching group link:', error);
            await client.sendText(m.chat, '❌ Failed to fetch group link. Make sure I am an admin.', m);
        }
    });
};
