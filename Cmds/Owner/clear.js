const ownerMiddleware = require('../../utility/botUtil/Ownermiddleware');

module.exports = async (context) => {
    await ownerMiddleware(context, async () => {
        const { client, m } = context;

        // Check if the session is active
        if (!client.user) {
            return m.reply("❌ Session is not active! Please restart and re-authenticate.");
        }

        if (!m || !m.key) {
            return m.reply("❌ Cannot delete an empty chat.");
        }

        try {
            await client.chatModify(
                { delete: true, lastMessages: [{ key: m.key, messageTimestamp: m.messageTimestamp }] },
                m.chat
            );
            m.reply("✅ Successfully deleted this chat!");
        } catch (err) {
            m.reply("❌ Failed to delete chat! Ensure your session is active.");
            console.error("Clear Chat Error:", err);
        }
    });
};
