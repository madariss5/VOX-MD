/* This is the main file for VOX-MD */

const {
  default: connect,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  makeInMemoryStore,
  downloadContentFromMessage,
  jidDecode,
  proto,
  getContentType,
} = require("@whiskeysockets/baileys");
const pino = require("pino");
const { Boom } = require("@hapi/boom");
const fs = require("fs");
const { exec, spawn, execSync } = require("child_process");
const axios = require("axios");
const express = require("express");
const { DateTime } = require("luxon");
const PhoneNumber = require("awesome-phonenumber");
const { botname, autobio, prefix, mode, autoview, autoread, presence } = require("./config");

const app = express();
const port = process.env.PORT || 10000;
const store = makeInMemoryStore({ logger: pino().child({ level: "silent", stream: "store" }) });

async function startVOXMD() {
  const { saveCreds, state } = await useMultiFileAuthState(`session`);
  const client = connect({
    logger: pino({ level: "silent" }),
    printQRInTerminal: true,
    version: [2, 3000, 1015901307],
    browser: ["VOX-MD", "Safari", "3.0"],
    auth: state,
  });

  store.bind(client.ev);
  setInterval(() => store.writeToFile("store.json"), 3000);

  if (autobio === "true") {
    setInterval(() => {
      const date = new Date();
      client.updateProfileStatus(
        `${botname} is active 24/7\n\n${date.toLocaleString("en-US", { timeZone: "Africa/Nairobi" })}`
      );
    }, 10 * 1000);
  }

  client.ev.on("messages.upsert", async (chatUpdate) => {
    try {
      let mek = chatUpdate.messages[0];
      if (!mek.message) return;
      mek.message = mek.message.ephemeralMessage ? mek.message.ephemeralMessage.message : mek.message;

      if (autoview === "true" && mek.key && mek.key.remoteJid === "status@broadcast") {
        await client.readMessages([mek.key]);
      } else if (autoread === "true" && mek.key && mek.key.remoteJid.endsWith("@s.whatsapp.net")) {
        await client.readMessages([mek.key]);
      }

      if (mek.key && mek.key.remoteJid.endsWith("@s.whatsapp.net")) {
        const Chat = mek.key.remoteJid;
        await client.sendPresenceUpdate(presence || "available", Chat);
      }
    } catch (err) {
      console.log(err);
    }
  });

  client.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === "close") {
      let reason = new Boom(lastDisconnect?.error)?.output.statusCode;
      switch (reason) {
        case DisconnectReason.badSession:
          console.log("Bad Session File, Please Delete Session and Scan Again");
          process.exit();
        case DisconnectReason.connectionClosed:
          console.log("Connection closed, reconnecting...");
          startVOXMD();
          break;
        case DisconnectReason.connectionLost:
          console.log("Connection Lost from Server, reconnecting...");
          startVOXMD();
          break;
        case DisconnectReason.connectionReplaced:
          console.log("Connection Replaced, Another New Session Opened, Please Restart Bot");
          process.exit();
        case DisconnectReason.loggedOut:
          console.log("Device Logged Out, Please Delete Session and Scan Again.");
          process.exit();
        case DisconnectReason.restartRequired:
          console.log("Restart Required, Restarting...");
          startVOXMD();
          break;
        case DisconnectReason.timedOut:
          console.log("Connection Timed Out, Reconnecting...");
          startVOXMD();
          break;
        default:
          console.log(`Unknown DisconnectReason: ${reason} | ${connection}`);
          startVOXMD();
      }
    } else if (connection === "open") {
      console.log(`✅ Connection successful\nBot is active.`);
    }
  });

  client.ev.on("creds.update", saveCreds);

  client.sendText = (jid, text, quoted = "", options) =>
    client.sendMessage(jid, { text: text, ...options }, { quoted });

  client.downloadMediaMessage = async (message) => {
    let mime = message.mimetype || "";
    let messageType = mime.split("/")[0];
    const stream = await downloadContentFromMessage(message, messageType);
    let buffer = Buffer.from([]);
    for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);
    return buffer;
  };
}

app.use(express.static("public"));
app.get("/", (req, res) => res.sendFile(__dirname + "/index.html"));
app.listen(port, () => console.log(`Server listening on http://localhost:${port}`));

startVOXMD();

module.exports = startVOXMD;

fs.watchFile(require.resolve(__filename), () => {
  fs.unwatchFile(require.resolve(__filename));
  console.log(`Updated ${__filename}`);
  delete require.cache[require.resolve(__filename)];
  require(require.resolve(__filename));
});
