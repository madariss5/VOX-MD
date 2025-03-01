const { makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } = require("@whiskeysockets/baileys");
const { Boom } = require("@hapi/boom");
const pino = require("pino");
const config = require("./config");

async function startVOXMD() {
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        auth: { creds: JSON.parse(Buffer.from(config.session.data, "base64").toString("utf-8")) },
        logger: pino({ level: config.bot.logLevel }),
    });

    sock.ev.on("connection.update", (update) => {
        const { connection } = update;
        if (connection === "open") console.log(`${config.bot.name} is online!`);
    });

    sock.ev.on("messages.upsert", async (msg) => {
        const m = msg.messages[0];
        if (!m.message || m.key.fromMe) return; // Ignore empty or self messages

        const sender = m.key.participant || m.key.remoteJid;
        const messageType = Object.keys(m.message)[0];

        let text = "";
        if (messageType === "conversation") text = m.message.conversation;
        else if (messageType === "extendedTextMessage") text = m.message.extendedTextMessage.text;

        console.log(`[${sender}] ${text}`);

        if (text.startsWith("!ping")) {
            await sock.sendMessage(sender, { text: "Pong!" });
        }

        if (config.settings.autoRemoveLinks && /\bhttps?:\/\/\S+/gi.test(text) && m.key.remoteJid.endsWith("@g.us")) {
            await sock.groupParticipantsUpdate(m.key.remoteJid, [sender], "remove");
            console.log(`Removed ${sender} for sending a link.`);
        }
    });
}

startVOXMD();
