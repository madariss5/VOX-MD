module.exports = async (context) => {
    const { client, m } = context;

    let sender, name;

    if (!m.quoted) {
        sender = m.sender;
        name = m.pushName;
    } else {
        sender = m.quoted.sender;
        name = "@" + sender.split("@")[0];
    }

    let ppUrl;
    try {
        ppUrl = await client.profilePictureUrl(sender, 'image');
    } catch {
        ppUrl = "https://i.postimg.cc/NjymQz1X/VOX-MD-BOT-LOGO.jpg";  // Default image
    }

    let status;
    try {
        status = await client.fetchStatus(sender);
    } catch {
        status = { status: "🚫 Privacy settings prevent viewing this About section." };
    }

    const profileCard = `╭───〔 👤 *USER PROFILE* 〕───╮\n\n` +
                        `📌 *Name:* ${name}\n` +
                        `📝 *About:* ${status.status}\n` +
                        `🆔 *User ID:* ${sender.split('@')[0]}\n\n` +
                        `╰──────────────────────╯`;

    const mess = {
        image: { url: ppUrl },
        caption: profileCard,
        mentions: m.quoted ? [m.quoted.sender] : []
    };

    await client.sendMessage(m.chat, mess, { quoted: m });
};
