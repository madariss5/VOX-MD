const fs = require("fs");
const path = require("path");

module.exports = async (context) => {
    const { client, m } = context;

    try {
        const ownerName = "Kanambo";
        const ownerNumber = "+254114148625"; // WhatsApp-compatible format
        const email = "voxmd@devopps.com";
        const organization = "VOXNET.INC";
        const footer = "🌟 Powered by: @ VOXNET.INC";

        // vCard for direct WhatsApp messaging
        const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${ownerName}
TEL;waid=${ownerNumber}:${ownerNumber}
EMAIL:${email}
ORG:${organization}
NOTE: Contact ${ownerName} for bot-related inquiries.
END:VCARD`;

        // Owner information
        const ownerInfo = `╭───────────◆
│ 👑 *Bot Owner Info*
│ 📌 *Name:* ${ownerName}
│ 📞 *Contact:* wa.me/${ownerNumber}
│ 📩 *Email:* ${email}
│ 🏢 *Org:* ${organization}
╰───────────◆
${footer}`;

        // Get a random image from Voxmdgall/Voxb
        const imagePath = path.resolve(__dirname, "../../Voxmdgall/Voxb");
        let imageBuffer = null;
        let imageFilePath = null;

        if (fs.existsSync(imagePath)) {
            const images = fs.readdirSync(imagePath).filter(file => file.endsWith(".jpg") || file.endsWith(".png"));
            if (images.length > 0) {
                const randomImage = images[Math.floor(Math.random() * images.length)];
                imageFilePath = path.join(imagePath, randomImage);
                imageBuffer = fs.readFileSync(imageFilePath); // Read image file
            }
        }

        // Send owner info with the random image as a header
        if (imageBuffer) {
            await client.sendMessage(
                m.chat,
                {
                    image: { url: imageFilePath },
                    caption: ownerInfo,
                },
                { quoted: m }
            );
        } else {
            // If no image is available, send owner info as text
            await client.sendMessage(
                m.chat,
                { text: ownerInfo },
                { quoted: m }
            );
        }

        // Send vCard contact
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

        // Send the specific voice file from Voxmdgall/Voxb/menu.mp3
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
