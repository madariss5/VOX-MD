const ownerMiddleware = require('../../utility/botUtil/Ownermiddleware');

module.exports = async (context) => {
    await ownerMiddleware(context, async () => {
        const { client, m, participants, text } = context;

        if (!m.isGroup) return m.reply("❌ *This command can only be used in groups.*");

        // Extract the country code from the user input
        const countryCode = text.trim();
        if (!countryCode) {
            return m.reply("❌ *Please specify the country code (e.g., +92 or +91).*");
        }

        // Fetch group members
        const membersToRemove = participants.filter(member => 
            member.id.startsWith(countryCode)
        );

        if (membersToRemove.length === 0) {
            return m.reply("⚠️ *No members found with country code* " + countryCode + ".");
        }

        // Notify group before removing members
        await client.sendMessage(
            m.chat, 
            { text: `🔴 *Removing members with country code* ${countryCode}...`, mentions: membersToRemove.map(a => a.id) }, 
            { quoted: m }
        );

        // Remove members
        for (let member of membersToRemove) {
            await client.groupParticipantsUpdate(m.chat, [member.id], "remove");
        }

        m.reply(`✅ *Successfully removed all members with country code* ${countryCode} *from the group.*`);
    });
};