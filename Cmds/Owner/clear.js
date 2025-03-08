const ownerMiddleware = require('../../utility/botUtil/Ownermiddleware');

module.exports = async (context) => {
    await ownerMiddleware(context, async () => {
        const { client, m } = context;

        if (!m || !m.key || !m.key.id) {  
            return m.reply("❌ Cannot delete an empty or invalid chat message.");  
        }

        try {
            // Check if the session is active and authenticated
            if (!client.authState || !client.authState.creds || !client.authState.creds.me) {
                return m.reply("⚠️ Session expired or not initialized. Please restart the bot.");
            }

            // Check if chat modification is supported
            if (!client.chatModify) {
                return m.reply("⚠️ Chat modification is not supported in this session.");
            }

            // Perform chat modification
            await client.chatModify(
                {
                    delete: true,
                    lastMessages: [{ key: m.key, messageTimestamp: m.messageTimestamp || Math.floor(Date.now() / 1000) }]
                },
                m.chat
            );

            m.reply("✅ Successfully deleted this chat!");
        } catch (error) {
            console.error("❌ Error executing clear:", error);
            m.reply("❌ Failed to delete the chat. Please check logs for more details.");
        }
    });
};
