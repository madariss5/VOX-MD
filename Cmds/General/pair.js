module.exports = async (context) => {
    const { client, m, text, fetchJson } = context;

    if (!text) {
        return m.reply("📌 *Enter a number to pair!*\nExample: `.pair 254114148625`");
    }

    try {
        const numbers = text.split(',')
            .map((v) => v.replace(/[^0-9]/g, '')) 
            .filter((v) => v.length > 5 && v.length < 20); 

        if (numbers.length === 0) {
            return m.reply("⚠️ *Invalid number!* Enter a correct number.");
        }

        for (const number of numbers) {
            const whatsappID = number + '@s.whatsapp.net';
            const result = await client.onWhatsApp(whatsappID);

            if (!result[0]?.exists) {
                return m.reply(`🚫 *${number} is not registered on WhatsApp!*`);
            }

            // Fetch pairing code from the Render API
            const apiUrl = `https://heroku-eokh.onrender.com/code?number=${number}`;
            
            try {
                const data = await fetchJson(apiUrl);
                console.log("API Response:", data); // Debugging log

                if (data?.success && data?.data?.['pair-code']) {
                    const paircode = data.data['pair-code'];

                    // First message to indicate process
                    await m.reply("⏳ *Generating pairing code...*");

                    // Sending the pairing code
                    const sentMessage = await client.sendMessage(m.chat, { 
                        text: `🔑 *Your Pairing Code:* \n\n\`\`\`${paircode}\`\`\`` 
                    });

                    // Follow-up message
                    await client.sendMessage(m.chat, { 
                        text: `✅ *Success!* Copy & paste the pairing code into your linked devices.`,
                        quoted: sentMessage
                    });

                    console.log(`✅ Pairing code sent to ${m.chat}`);
                } else {
                    console.error("❌ API Error:", data);
                    m.reply("⚠️ *Failed to fetch pairing code! Try again.*");
                }
            } catch (error) {
                console.error("❌ API Fetch Error:", error);
                m.reply("⚠️ *Error connecting to the server! Try again later.*");
            }
        }
    } catch (e) {
        console.error("❌ Unexpected Error:", e);
        m.reply("⚠️ *An unexpected error occurred!*");
    }
};
