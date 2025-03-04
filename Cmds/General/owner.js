const fs = require("fs");
const path = require("path");

module.exports = async (context) => {
    const { client, m } = context;

    try {
        const ownerName = "Kanambo";
        const ownerNumber = "+254114148625"; // Format: Without '+' for WhatsApp vCard
        const email = "voxmd@devopps.com";
        const organization = "VOXNET.INC";
        const footer = "🌟 Powered by: @ VOXNET.INC";

        // vCard that allows direct WhatsApp messaging
        const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${ownerName}
TEL;waid=${ownerNumber}:${ownerNumber}
EMAIL:${email}
ORG:${organization}
NOTE: Contact ${ownerName} for bot-related inquiries.
END:VCARD`;

        // Owner info (sent with image)
        const ownerInfo = `╭───────────◆
│ 👑 *Bot Owner Info*
│ 📌 *Name:* ${ownerName}
│ 📞 *Contact:* wa.me/${ownerNumber}
│ 📩 *Email:* ${email}
│ 🏢 *Org:* ${organization}
╰───────────◆
${footer}`;

        // Path to the image folder
        const imagePath = path.resolve(__dirname, "../../Voxmdgall/Voxb");

        // Check if folder exists and contains images
        let imageBuffer = null;
        if (fs.existsSync(imagePath)) {
            const images = fs.readdirSync(imagePath).filter(file => file.endsWith(".jpg") || file.endsWith(".png"));
            if (images.length > 0) {
                const randomImage = images[Math.floor(Math.random() * images.length)];
                const imageUrl = path.join(imagePath, randomImage);
                imageBuffer = fs.readFileSync(imageUrl); // Read image as buffer
            }
        }

        // Send owner info with image (compact format)
        await client.sendMessage(
            m.chat,
            {
                image: imageBuffer ? { mimetype: "image/jpeg", jpegThumbnail: imageBuffer } : null,
                caption: ownerInfo,
            },
            { quoted: m }
        );

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
