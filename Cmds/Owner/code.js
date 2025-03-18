const ownerMiddleware = require('../../utility/botUtil/Ownermiddleware'); 

module.exports = async (context) => {
    const { client, m, text, isGroup, senderNumber } = context;
    
    // Define the bot owner's number (Set this in your config)
    const ownerNumber = "254114148625"; // Replace with actual owner number

    try {
        if (!isGroup) {
            return m.reply("*🚫 This command can only be used in groups.*");
        }

        // Check if sender is the bot owner
        if (senderNumber !== ownerNumber) {
            return m.reply("> *🚫 Only the bot owner can use this command.*");
        }

        // Extract the country code from user input
        const countryCode = text.split(" ")[0];
        if (!countryCode) {
            return m.reply("❌ *Please specify the country code (e.g., +92 or +91).*");
        }

        // Fetch group members
        const groupMetadata = await client.groupMetadata(m.chat);
        const participants = groupMetadata.participants;

        // Filter members with the specified country code
        const membersToRemove = participants.filter(member => 
            member.id.startsWith(countryCode)
        );

        if (membersToRemove.length === 0) {
            return m.reply("⚠️ No members found with country code " + countryCode + ".");
        }

        // Remove members
        for (let member of membersToRemove) {
            await client.groupParticipantsUpdate(m.chat, [member.id], "remove");
        }

        m.reply("✅ *Removed all members with country code " + countryCode + " from the group.*");

    } catch (error) {
        console.error("Group Remove Error:", error);
        m.reply("❌ *Error:* " + error.message);
    }
};