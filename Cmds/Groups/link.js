const middleware = require('../../utility/botUtil/middleware');

module.exports = async (m, { conn, args }) => {
    try {
        let group = m.chat;
        let link = 'https://chat.whatsapp.com/' + await conn.groupInviteCode(group);

        await conn.reply(m.chat, `🔗 *Group Invite Link:*\n${link}`, m, { detectLink: true });

    } catch (err) {
        console.error('Error fetching group link:', err);
        await conn.reply(m.chat, '❌ Failed to fetch group link. Make sure I am an admin.', m);
    }
};

module.exports.command = ['link', 'linkgroup'];
module.exports.group = true;
module.exports.botAdmin = true;
