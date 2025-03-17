const ownerMiddleware = require('../../utility/botUtil/Ownermiddleware'); 
module.exports = async (context) => {
    const { client, m } = context;

    try {
        await client.chatModify(
            { delete: true, lastMessages: [{ key: m.key, messageTimestamp: m.messageTimestamp }] },
            m.chat
        );

        await m.reply("Silva MD Bot successfully deleted this chat!");
    } catch (error) {
        console.error("Chat deletion failed:", error.message);
        await m.reply("❌ Failed to delete the chat.");
    }
};