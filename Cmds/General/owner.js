const fs = require("fs");
const path = require("path");

module.exports = async (context) => {
    const { client, m } = context;

    try {
        const ownerName = "Kanambo";
        const ownerNumber = "+254114148625";
        const email = "voxmd@devopps.com";
        const organization = "VOXNET.INC";
        const footer = "🌟 Powered by: @ VOXNET.INC";

        const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${ownerName}
TEL;TYPE=CELL:${ownerNumber}
EMAIL:${email}
ORG:${organization}
NOTE: Contact ${ownerName} for bot-related inquiries.
END:VCARD`;

        const ownerInfo = `╭───────────◆
│ 👑 *Bot Owner Info*
│ 📌 *Name:* ${ownerName}
│ 📞 *Contact:* ${ownerNumber}
│ 📩 *Email:* ${email}
│ 🏢 *Org:* ${organization}
╰───────────◆
${footer}`;

        // Send owner info
        await client.sendMessage(m.chat, { text: ownerInfo }, { quoted: m });

        // Send vCard
        await client.sendMessage(
            m.chat,
            {
                contacts: {
                    displayName: ownerName,
                    contacts: [{ vcard }],
                },
            },
            { quoted: m }
        );

        // Send a random image from Voxmdgall/Voxb
        const imagePath = path.resolve(__dirname, "../../Voxmdgall/Voxb");
        if (fs.existsSync(imagePath)) {
            const images = fs.readdirSync(imagePath).filter(file => file.endsWith(".jpg") || file.endsWith(".png"));
            if (images.length > 0) {
                const randomImage = images[Math.floor(Math.random() * images.length)];
                const imageUrl = path.join(imagePath, randomImage);

                await client.sendMessage(
                    m.chat,
                    {
                        image: { url: imageUrl },
                        caption: "👑 *Kanambo - The Bot Owner!*",
                    },
                    { quoted: m }
                );
            }
        }

        // Send a specific voice file from Voxmdgall/Voxb/menu.mp3
        const voicePath = path.resolve(__dirname, "../../Voxmdgall/Voxb/menu.mp3");
        if (fs.existsSync(voicePath)) {
            await client.sendMessage(
                m.chat,
                {
                    audio: { url: voicePath },
                    mimetype: "audio/mpeg",
                    ptt: true,
                    caption: "📢 Need assistance? Contact the owner now!",
                },
                { quoted: m }
            );
        }

    } catch (e) {
        console.error(e);
        m.reply("⚠️ Error retrieving owner details.");
    }
};
