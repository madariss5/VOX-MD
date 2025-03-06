module.exports = async (context) => {
    const { client, m, args } = context;

    if (!args[0] || args[0].length < 7 || !args[0].includes("xxx")) {
        return m.reply(
            "⚠️ *Invalid Input!*\n\nUse format: `.onwa <country-code><prefix>xxx`\n\nExample: `.onwa 25414148xxx`"
        );
    }

    let prefix = args[0].replace("xxx", ""); // Remove "xxx" to get the actual prefix
    let generatedNumbers = [];

    for (let i = 0; i < 50; i++) {
        let randomLast3 = Math.floor(100 + Math.random() * 900); // Generates random 3-digit number
        let fullNumber = prefix + randomLast3;
        generatedNumbers.push(fullNumber);
    }

    let message = `🔎 *Checking Numbers Matching:* *${args[0]}*\n\n`;

    for (let num of generatedNumbers) {
        try {
            let waCheck = await client.onWhatsApp(num + "@s.whatsapp.net");

            if (waCheck.length > 0) {
                message += `✅ *+${num}* - *WhatsApp Registered*\n`;
            } else {
                message += `❌ *+${num}* - *Not on WhatsApp*\n`;
            }
        } catch (error) {
            console.log(`Error checking ${num}:`, error);
            message += `⚠️ *+${num}* - *Check Failed*\n`;
        }
    }

    await client.sendMessage(m.chat, { text: message }, { quoted: m });
};
