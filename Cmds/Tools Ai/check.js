const axios = require("axios");

module.exports = async (context) => {
    const { client, m, text } = context;

    if (!text) return m.reply("❌ Please provide a number to search.");

    let regex = /x/g;
    if (!text.match(regex)) return m.reply(`⚠️ *Example:* _-check 2547001431xx_`);

    let random = text.match(regex).length;
    let total = Math.pow(10, random);
    let array = [];

    await m.reply("🔍 *Checking WhatsApp numbers... Please wait...*");

    for (let i = 0; i < total; i++) {
        let list = [...i.toString().padStart(random, "0")];
        let result = text.replace(regex, () => list.shift()) + "@s.whatsapp.net";

        let isRegistered = await client.onWhatsApp(result).then(v => (v[0] || {}).exists);
        let info = null;

        if (isRegistered) {
            try {
                info = await client.fetchStatus(result);
            } catch (err) {
                info = { status: "No bio available", setAt: null };
            }
        }

        array.push({ exists: isRegistered, jid: result, status: info?.status || "No bio available", setAt: info?.setAt || null });
    }

    let registeredUsers = array.filter(v => v.exists);
    let unregisteredUsers = array.filter(v => !v.exists);

    let txt = `📌 *WhatsApp Number Search Results*\n\n`;

    if (registeredUsers.length > 0) {
        txt += `✅ *Registered Numbers:*\n`;
        txt += registeredUsers
            .map(v => `• 🔗 wa.me/${v.jid.split("@")[0]}\n📜 *Bio:* ${v.status}\n📅 *Set on:* ${v.setAt ? formatDate(v.setAt) : "Unknown"}`)
            .join("\n\n");
    } else {
        txt += "❌ No registered numbers found.\n";
    }

    if (unregisteredUsers.length > 0) {
        txt += `\n\n🚫 *Not Registered:*\n${unregisteredUsers.map(v => v.jid.split("@")[0]).join("\n")}`;
    }

    await m.reply(txt);
};

function formatDate(timestamp, locale = "en") {
    if (!timestamp) return "Unknown";
    let d = new Date(timestamp);
    return d.toLocaleDateString(locale, { timeZone: "Africa/Nairobi" });
}