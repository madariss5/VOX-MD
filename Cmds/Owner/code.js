const ownerMiddleware = require('../../utility/botUtil/Ownermiddleware');

module.exports = async (context) => {
    await ownerMiddleware(context, async () => {
        const { client, m, participants, text } = context;

        if (!m.isGroup) return m.reply("❌ *This command can only be used in groups.*");

        // Extract the country code from user input
        const countryCode = text.trim();
        if (!countryCode.startsWith('+')) {
            return m.reply("❌ *Please enter a valid country code (e.g., +254, +91, +92).*");
        }

        // Extract numbers correctly & filter by country code
        const membersToRemove = participants.filter(member => {
            const rawNumber = member.id.replace(/@s\.whatsapp\.net$/, ''); // Remove @s.whatsapp.net
            return rawNumber.startsWith(countryCode.replace('+', '')); // Compare with input code
        });

        if (membersToRemove.length === 0) {
            return m.reply(`⚠️ *No members found with country code* ${countryCode}.`);
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