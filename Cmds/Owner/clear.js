const ownerMiddleware = require('../../utility/botUtil/Ownermiddleware');
module.exports = async (m, { conn }) => {
    try {
        await conn.chatModify(
            { delete: true, lastMessages: [{ key: m.key, messageTimestamp: m.messageTimestamp }] },
            m.chat
        );
        await m.reply("Successfully deleted this chat!");
    } catch (err) {
        await m.reply("❌ Failed to delete chat!");
        console.error(err);
    }
};
