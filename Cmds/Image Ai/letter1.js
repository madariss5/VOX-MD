const axios = require("axios");

module.exports = async (context) => {
    const { client, m, text } = context;

    if (!text) {
        return m.reply("❌ *Please provide the note content!*\n\nExample usage:\n`.note Name | Class | Subject | Date (YYYY-MM-DD) | Your note here`");
    }

    try {
        // Notify user that the process has started
        await client.sendMessage(m.chat, { 
            text: "📝 *Generating your handwritten note... Please wait!* ⏳" 
        });

        // Parse user input
        const input = text.split("|").map((t) => t.trim());
        if (input.length < 5) {
            return m.reply("❌ *Invalid format!*\n\nExample:\n`.note Hikaru | XII - Bio A | Sexual Organs | 2025-01-25 | The human reproductive organs consist of...`");
        }

        const [name, classroom, subject, date, content] = input;
        const font = "MyHandsareHoldingYou.ttf"; // Default font
        const format = "png"; // Default format

        // Construct API URL
        const apiUrl = `https://fastrestapis.fasturl.cloud/tool/texttonote?name=${encodeURIComponent(name)}&classroom=${encodeURIComponent(classroom)}&subject=${encodeURIComponent(subject)}&date=${encodeURIComponent(date)}&content=${encodeURIComponent(content)}&font=${encodeURIComponent(font)}&format=${encodeURIComponent(format)}`;

        // Send the generated note as an image
        await client.sendMessage(
            m.chat,
            {
                image: { url: apiUrl },
                caption: `📖 *Here is your handwritten note, ${name}:*\n\n📌 *Subject:* ${subject}\n📅 *Date:* ${date}\n📝 _Handwritten with love_ 💙`,
            },
            { quoted: m }
        );
    } catch (error) {
        console.error("Handwritten note error:", error.message);
        m.reply("❌ *Failed to generate the handwritten note! Make sure your input is correct.*");
    }
};
