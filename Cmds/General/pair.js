module.exports = async (context) => {
    const { client, m, text, fetchJson } = context;

    if (!text) {
        return m.reply("What number do you want to pair?");
    }

    try {
        const numbers = text.split(',')
            .map((v) => v.replace(/[^0-9]/g, '')) 
            .filter((v) => v.length > 5 && v.length < 20); 

        if (numbers.length === 0) {
            return m.reply("The number you have entered is not valid. Eh?");
        }

        for (const number of numbers) {
            const whatsappID = number + '@s.whatsapp.net';
            const result = await client.onWhatsApp(whatsappID);

            if (!result[0]?.exists) {
                return m.reply(`How can you pair a number that is not registered on WhatsApp?`);
            }

            // Use Render API instead of Heroku’s direct link
            const apiUrl = `https://heroku-eokh.onrender.com/code?number=${number}`;
            
            try {
                const data = await fetchJson(apiUrl);
                console.log("API Response:", data); // Debugging step

                if (data?.success && data?.data?.['pair-code']) {
                    const paircode = data.data['pair-code'];
                    
                    await m.reply("Wait a moment...");
                    const mas = await client.sendMessage(m.chat, { text: paircode });

                    await client.sendMessage(m.chat, { 
                        text: `Above quoted text is your pairing code, copy/paste it in your linked devices then wait for session ID. 👍` 
                    }, { quoted: mas });
                } else {
                    console.error("Invalid API response:", data);
                    m.reply("Failed to fetch pairing code for the number. Check logs.");
                }
            } catch (error) {
                console.error("Error fetching from API:", error);
                m.reply("Error contacting the pairing server. Try again later.");
            }
        }
    } catch (e) {
        console.error(e);
        m.reply("An error occurred while processing your request.\n" + e);
    }
};
