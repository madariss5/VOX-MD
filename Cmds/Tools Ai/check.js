module.exports = async (context) => {
    const { client, m, args } = context;

    if (!args[0] || args[0].length < 7 || !args[0].includes("xxx")) {
        return m.reply(
            "⚠️ *Invalid Input!*\n\n✅ Use format: `.onwa <country-code><prefix>xxx`\n\nExample: `.onwa 25414148xxx`"
        );
    }

    let input = args[0];
    let countryCode = input.match(/^\d+/)[0]; // Extract country code
    let prefix = input.replace("xxx", "").replace(countryCode, ""); // Extract prefix without country code

    let generatedNumbers = new Set();

    // **Generate 100 numbers within the same country code**
    while (generatedNumbers.size < 100) {
        let randomLast3 = Math.floor(100 + Math.random() * 900); // Random 3 digits
        generatedNumbers.add(`${countryCode}${prefix}${randomLast3}`);
    }

    let message = `🕵️ *Scanning Numbers Matching:* *${args[0]}*\n\n`;
    let counter = 1;

    for (let num of generatedNumbers) {
        try {
            let waCheck = await client.onWhatsApp(num + "@s.whatsapp.net");

            if (waCheck.length > 0) {
                let about;
                try {
                    let status = await client.fetchStatus(num + "@s.whatsapp.net");
                    about = status.status || "No About Set.";
                } catch {
                    about = "About not accessible due to privacy settings.";
                }

                message += `\n🌍 *${counter}. +${num}*\n✅ *Registered on WhatsApp!*\n📝 *About:* ${about}\n`;
            } else {
                message += `\n❌ *${counter}. +${num}* - *Not on WhatsApp*\n`;
            }
        } catch (error) {
            console.log(`Error checking ${num}:`, error);
            message += `\n⚠️ *${counter}. +${num}* - *Check Failed*\n`;
        }

        counter++;
    }

    await client.sendMessage(m.chat, { text: message }, { quoted: m });
};
