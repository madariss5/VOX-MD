const ownerMiddleware = require('../../utility/botUtil/Ownermiddleware'); 
module.exports = async (context) => {
    const { client, m } = context;

    try {
        // Delete the specific message
        await client.chatModify(
            { delete: true, lastMessages: [{ key: m.key, messageTimestamp: m.messageTimestamp }] },
            m.chat
        );

        // Clear the entire chat (Only works if the bot is an admin)
        await client.chatModify({ clear: true }, m.chat);

        await m.reply("✅ Silva MD Bot has successfully deleted the message and cleared the chat!");
    } catch (error) {
        console.error("Chat deletion failed:", error.message);
        await m.reply("❌ Failed to delete or clear the chat.");
    }
};