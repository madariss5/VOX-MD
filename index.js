/* VOX-MD - The Modern WhatsApp Bot */
/* This is the main file */

const {
  default: VOXMDConnect,
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
const FileType = require("file-type");
const { exec, spawn, execSync } = require("child_process");
const axios = require("axios");
const chalk = require("chalk");
const figlet = require("figlet");
const express = require("express");
const app = express();
const port = process.env.PORT || 10000;
const _ = require("lodash");
const PhoneNumber = require("awesome-phonenumber");
const { imageToWebp, videoToWebp, writeExifImg, writeExifVid } = require("./lib/exif");
const { isUrl, generateMessageTag, getBuffer, getSizeMedia, fetchJson, await, sleep } = require("./lib/botFunctions");

const store = makeInMemoryStore({ logger: pino().child({ level: "silent", stream: "store" }) });

const authentication = require("./kanambo.js");
const { smsg } = require("./smsg");
const { autoview, autoread, botname, autobio, mode, prefix, presence, autolike } = require("./settings");
const { DateTime } = require("luxon");
const { commands, totalCommands } = require("./Voxmdhandler");

authentication();
const groupEvents = require("./groupEvents.js");

async function startVOXMD() {
  const { saveCreds, state } = await useMultiFileAuthState(`session`);

  const client = VOXMDConnect({
    logger: pino({ level: "silent" }),
    printQRInTerminal: true,
    version: [2, 3000, 1015901307],
    browser: [`VOXMD`, "Safari", "3.0"],
    fireInitQueries: false,
    shouldSyncHistoryMessage: false,
    downloadHistory: false,
    syncFullHistory: false,
    generateHighQualityLinkPreview: true,
    markOnlineOnConnect: true,
    keepAliveIntervalMs: 30_000,
    auth: state,
    getMessage: async (key) => {
      if (store) {
        const mssg = await store.loadMessage(key.remoteJid, key.id);
        return mssg.message || undefined;
      }
      return { conversation: "HERE" };
    },
  });

  store.bind(client.ev);
  setInterval(() => store.writeToFile("store.json"), 3000);

  if (autobio === "true") {
    setInterval(() => {
      const date = new Date();
      client.updateProfileStatus(
        `${botname} is active 24/7\n\n${date.toLocaleString("en-US", { timeZone: "Africa/Nairobi" })} It's a ${date.toLocaleString("en-US", { weekday: "long", timeZone: "Africa/Nairobi" })}.`
      );
    }, 10 * 1000);
  }

  client.ev.on("messages.upsert", async (chatUpdate) => {
    try {
      mek = chatUpdate.messages[0];
      if (!mek.message) return;
      mek.message = Object.keys(mek.message)[0] === "ephemeralMessage" ? mek.message.ephemeralMessage.message : mek.message;

      if (autoview === "true" && autolike === "true" && mek.key && mek.key.remoteJid === "status@broadcast") {
        const mokayas = await client.decodeJid(client.user.id);
        if (mek.status) return;
        await client.sendMessage(mek.key.remoteJid, { react: { key: mek.key, text: "💚" } }, { statusJidList: [mek.key.participant, mokayas] });
      }

      if (autoview === "true" && mek.key && mek.key.remoteJid === "status@broadcast") {
        await client.readMessages([mek.key]);
      } else if (autoread === "true" && mek.key && mek.key.remoteJid.endsWith("@s.whatsapp.net")) {
        await client.readMessages([mek.key]);
      }

      if (!client.public && !mek.key.fromMe && chatUpdate.type === "notify") return;
      m = smsg(client, mek, store);
      require("./Voxdat")(client, m, chatUpdate, store);
    } catch (err) {
      console.log(err);
    }
  });

  client.ev.on("group-participants.update", async (m) => {
    groupEvents(client, m);
  });

  client.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === "close") {
      let reason = new Boom(lastDisconnect?.error)?.output.statusCode;
      if (reason === DisconnectReason.badSession) {
        console.log("Bad Session File, Please Delete Session and Scan Again");
        process.exit();
      } else if (reason === DisconnectReason.connectionClosed) {
        console.log("Connection closed, reconnecting....");
        startVOXMD();
      } else if (reason === DisconnectReason.connectionLost) {
        console.log("Connection Lost from Server, reconnecting...");
        startVOXMD();
      } else if (reason === DisconnectReason.connectionReplaced) {
        console.log("Connection Replaced, Another New Session Opened, Please Restart Bot");
        process.exit();
      } else if (reason === DisconnectReason.loggedOut) {
        console.log("Device Logged Out, Please Delete File creds.json and Scan Again.");
        process.exit();
      } else if (reason === DisconnectReason.restartRequired) {
        console.log("Restart Required, Restarting...");
        startVOXMD();
      } else if (reason === DisconnectReason.timedOut) {
        console.log("Connection Timed Out, Reconnecting...");
        startVOXMD();
      } else {
        console.log(`Unknown Disconnect Reason: ${reason} | ${connection}`);
        startVOXMD();
      }
    } else if (connection === "open") {
      await client.groupAcceptInvite("EZaBQvil8qT9JrI2aa1MAE");
      console.log(`✅ Connection successful\nLoaded ${totalCommands} commands.\nBot is active.`);
    }
  });

  client.ev.on("creds.update", saveCreds);
}

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.listen(port, () => console.log(`Server listening on port http://localhost:${port}`));

startVOXMD();

module.exports = startVOXMD;

let file = require.resolve(__filename);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  console.log(chalk.redBright(`Update ${__filename}`));
  delete require.cache[file];
  require(file);
});