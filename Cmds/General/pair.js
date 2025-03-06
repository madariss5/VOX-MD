module.exports = async (context) => {
    const { client, m, text, fetchJson } = context;

    if (!text) {
        return m.reply("❌ *Provide a number to pair!*\nExample: `.pair 254712345678`");
    }

    try {
        const numbers = text
            .split(',')
            .map((v) => v.replace(/[^0-9]/g, '')) 
            .filter((v) => v.length > 5 && v.length < 20); 

        if (numbers.length === 0) {
            return m.reply("❌ *Invalid number format!* Try again.");
        }

        for (const number of numbers) {
            const whatsappID = number + '@s.whatsapp.net';
            const result = await client.onWhatsApp(whatsappID); 

            if (!result[0]?.exists) {
                await m.reply(`⚠️ *Number not registered on WhatsApp:* +${number}`);
                continue;
            }

            // Fetch pairing code
            const apiURL = `https://pairv-b4fcde0818fd.herokuapp.com/code?number=${number}`;
            const data = await fetchJson(apiURL);

            if (!data?.success || !data?.data?.['pair-code']) {
                await m.reply(`❌ *Failed to fetch pairing code for +${number}*.`);
                continue;
            }

            await m.reply(`⏳ *Fetching pairing code for +${number}...*`);

            const pairCode = data.data['pair-code'];
            const msg = await client.sendMessage(m.chat, { text: `🔑 *Pairing Code:* ${pairCode}` });

            await client.sendMessage(
                m.chat,
                { text: "📌 *Copy and paste the above code into your Linked Devices, then wait for the session ID. 👍*" },
                { quoted: msg }
            );
        }
    } catch (e) {
        console.error(e);
        m.reply("⚠️ *Error while processing your request!*\n" + e.message);
    }
};
