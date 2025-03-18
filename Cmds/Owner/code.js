const ownerMiddleware = require('../../utility/botUtil/Ownermiddleware');

module.exports = async (context) => {
    await ownerMiddleware(context, async () => {
        const { client, m, participants, text } = context;

        if (!m.isGroup) return m.reply("❌ *This command can only be used in groups.*");

        try {
            // Extract the country code from user input
            const countryCode = text.trim();
            if (!countryCode.startsWith('+') || isNaN(countryCode.slice(1))) {
                return m.reply("❌ *Please enter a valid country code (e.g., +254, +91, +92).*");
            }

            // Ensure bot is an admin before proceeding
            const groupMetadata = await client.groupMetadata(m.chat);
            const botNumber = client.user.id.split(":")[0] + "@s.whatsapp.net";
            const botIsAdmin = groupMetadata.participants.some(p => p.id === botNumber && p.admin);

            if (!botIsAdmin) {
                return m.reply("⚠️ *I need admin privileges to remove members.*");
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

            // Remove members in a safe way (one by one to avoid rate limits)
            for (let member of membersToRemove) {
                await client.groupParticipantsUpdate(m.chat, [member.id], "remove").catch(err => {
                    console.error("❌ Failed to remove:", member.id, err);
                });
                await new Promise(resolve => setTimeout(resolve, 1500)); // Delay to avoid spam removal
            }

            m.reply(`✅ *Successfully removed all members with country code* ${countryCode} *from the group.*`);
        } catch (error) {
            console.error("Group Remove Error:", error);
            m.reply("⚠️ *Error occurred while removing members. Please try again later.*");
        }
    });
};