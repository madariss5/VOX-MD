const ownerMiddleware = require('../../utility/botUtil/Ownermiddleware');

module.exports = async (context) => {
    await ownerMiddleware(context, async () => {
        const { client, m } = context;

        if (!m || !m.key || !m.key.id) {  
            return m.reply("❌ Cannot delete an empty or invalid chat message.");  
        }

        try {
            // Ensure session is valid before deleting
            if (!client.authState || !client.authState.creds) {
                return m.reply("⚠️ Session expired. Please restart the bot.");
            }

            await client.chatModify(
                {
                    delete: true,
                    lastMessages: [
                        { key: m.key, messageTimestamp: m.messageTimestamp || Math.floor(Date.now() / 1000) }
                    ]
                },
                m.chat
            );

            m.reply("✅ Successfully deleted this chat!");
        } catch (error) {
            console.error("Error executing clear:", error);
            m.reply("❌ Failed to delete the chat. Check console for details.");
        }
    });
};
