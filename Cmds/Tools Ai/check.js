const axios = require("axios");

module.exports = async (context) => {
    const { client, m, text } = context;

    if (!text || !text.includes("xxx")) {
        m.reply("⚠️ *Incorrect format!*\nUse: `.check <countrycode+first6digitsxxx>`\nExample: `.onwa 25414148xxx`");
        return;
    }

    const baseDigits = text.replace("xxx", "");
    if (isNaN(baseDigits) || baseDigits.length < 6) {
        m.reply("⚠️ *Invalid input!*\nEnter a valid country code and 6 digits before 'xxx'.");
        return;
    }

    m.reply("⏳ *Fetching WhatsApp numbers... Please wait.*");

    const numList = [];
    for (let i = 0; i < 200; i++) {
        let randomDigits = Math.floor(100 + Math.random() * 899); // Random 3-digit suffix
        numList.push(baseDigits + randomDigits);
    }

    let registeredNumbers = [];
    for (let num of numList) {
        try {
            let response = await axios.get(`https://api.numlookupapi.com/v1/validate/${num}?apikey=num_live_R7RgZmSuj7CO8ZeWJRgslk8BV63pa50c5r7IBtJJ`);
            
            if (response.data.valid && response.data.is_prepaid === true) {
                let status;
                try {
                    status = await client.fetchStatus(num + "@s.whatsapp.net");
                } catch {
                    status = { status: "No About info" };
                }

                registeredNumbers.push({
                    number: num,
                    status: status.status
                });
            }
        } catch (error) {
            console.log(`Error checking number ${num}:`, error);
        }
    }

    if (registeredNumbers.length === 0) {
        m.reply("❌ *No registered WhatsApp numbers found!*");
        return;
    }

    let msg = "✅ *Registered WhatsApp Numbers Found!*\n\n";
    registeredNumbers.forEach((data, index) => {
        msg += `*${index + 1}.* 📞 +${data.number}\n📌 *About:* ${data.status}\n\n`;
    });

    client.sendMessage(m.chat, { text: msg }, { quoted: m });
};
