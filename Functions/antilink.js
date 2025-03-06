module.exports = async (client, m, isBotAdmin, isAdmin, Owner, body) => {
    try {
        // Ensure required parameters exist
        if (!m || !m.sender || !m.chat || !body) return;

        // Check if the message contains any type of link
        const linkRegex = /(https?:\/\/[^\s]+)/gi;
        if (body.match(linkRegex) && !Owner && isBotAdmin && !isAdmin && m.isGroup) {
            const kid = m.sender;

            // Notify the group about the removal
            await client.sendMessage(m.chat, {
                text: `🚨 *Link Detected!*\n\n@${kid.split("@")[0]}, sending links is prohibited!\n\n⏳ *Removing...*`,
                contextInfo: { mentionedJid: [kid] }
            }, { quoted: m });

            // Delete the message containing the link
            await client.sendMessage(m.chat, {
                delete: {
                    remoteJid: m.chat,
                    fromMe: false,
                    id: m.key.id,
                    participant: kid
                }
            });

            // Remove the user from the group
            await client.groupParticipantsUpdate(m.chat, [kid], 'remove');
        }
    } catch (error) {
        console.error("Antilink Error:", error);
    }
};
