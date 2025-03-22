/* VOX-MD - The Modern WhatsApp Bot */

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
const fs = require("fs");
const FileType = require("file-type");
const axios = require("axios");
const { exec, spawn, execSync } = require("child_process");
const express = require("express");
require("events").EventEmitter.defaultMaxListeners = 50;

const app = express();
const port = process.env.PORT || 10000;
const PhoneNumber = require("awesome-phonenumber");
const { imageToWebp, videoToWebp, writeExifImg, writeExifVid } = require("./lib/exif");
const { isUrl, generateMessageTag, getBuffer, getSizeMedia, fetchJson, await, sleep } = require("./lib/botFunctions");
const store = makeInMemoryStore({ logger: pino().child({ level: "silent", stream: "store" }) });
const { session } = require("./settings");
const authenticateSession = require("./kanambo"); // Import authentication function

authenticateSession(); // Authenticate session
const path = require("path");
const sessionName = path.join(__dirname, "..", "session");
const { smsg } = require("./smsg");
const { autoview, presence, autoread, botname, autobio, mode, prefix, dev, autolike } = require("./settings");
const { commands, totalCommands } = require("./VoxMdhandler");
const groupEvents = require("./groupEvents.js");

async function startVOXMD() {
  const { saveCreds, state } = await useMultiFileAuthState("session");

  const client = VOXMDConnect({
    logger: pino({ level: "silent" }),
    printQRInTerminal: true,
    version: [2, 3000, 1015901307],
    browser: ["VOX-MD", "Safari", "3.0"],
    auth: state,
  });

  store.bind(client.ev);
  setInterval(() => store.writeToFile("store.json"), 3000);

  // ✅ Auto-bio update
  if (autobio === "true") {
    setInterval(() => {
      const date = new Date();
      client.updateProfileStatus(
        `⚡ ${botname} is active 24/7 ⚡\n📅 ${date.toLocaleString("en-US", { timeZone: "Africa/Nairobi", weekday: "long" })}`
      );
    }, 10 * 1000);
  }

  client.ev.removeAllListeners("messages.upsert");
  client.ev.on("messages.upsert", async (chatUpdate) => {
    try {
      let mek = chatUpdate.messages[0];
      if (!mek?.message) return;

      mek.message = mek.message.ephemeralMessage ? mek.message.ephemeralMessage.message : mek.message;

      // ✅ Auto-view & Auto-like status updates  
      if (autoview?.trim().toLowerCase() === "true" && mek.key?.remoteJid === "status@broadcast") {  
        await client.readMessages([mek.key]);  
        if (autolike?.trim().toLowerCase() === "true") {  
          try {  
            let reactionKey = mek.key;  
            let reactEmoji = "💚"; // Set your emoji  
            if (reactionKey?.remoteJid && reactionKey.id) {  
              await client.sendMessage(reactionKey.remoteJid, {  
                react: { key: reactionKey, text: reactEmoji }  
              });  
            }  
          } catch (error) {}  
        }  
      }

      // ✅ Auto-read private messages  
      if (autoread?.trim().toLowerCase() === "true" && mek.key?.remoteJid?.endsWith("@s.whatsapp.net")) {  
        await client.readMessages([mek.key]);  
      }

      // ✅ Presence Updates  
      if (mek.key?.remoteJid.endsWith("@s.whatsapp.net")) {  
        let chat = mek.key.remoteJid;  
        let presenceType = presence.toLowerCase();  
        if (["online", "typing", "recording"].includes(presenceType)) {  
          await client.sendPresenceUpdate(presenceType, chat);  
        }  
      }

      let sender = mek.key?.remoteJid || mek.participant || mek.key?.participant;

      // ✅ Owner & Developer Check  
      const ownerNumber = "254114148625";  
      if (mode?.toLowerCase() === "private") {  
        const allowedUsers = [`${ownerNumber}@s.whatsapp.net`, `${dev}@s.whatsapp.net`];  
        if (!mek.key.fromMe && !allowedUsers.includes(sender)) return;  
      }

      let m = smsg(client, mek, store);
      require("./Voxdat")(client, m, chatUpdate, store);
    } catch (error) {}
  });

  client.ev.removeAllListeners("connection.update");  
  client.ev.on("connection.update", async (update) => {  
    const { connection, lastDisconnect } = update;  

    if (connection === "open") {  
      try {  
        let inviteCode = "EZaBQvil8qT9JrI2aa1MAE";  
        let groupInfo = await client.groupGetInviteInfo(inviteCode);  
        if (groupInfo) {  
          await client.groupAcceptInvite(inviteCode);  
        }  
      } catch (error) {}  

      const getGreeting = () => {  
        const currentHour = new Date().getHours();
        if (currentHour >= 5 && currentHour < 12) return "🌄 *Good Morning*";  
        if (currentHour >= 12 && currentHour < 18) return "☀️ *Good Afternoon*";  
        if (currentHour >= 18 && currentHour < 22) return "🌆 *Good Evening*";  
        return "🌙 *Good Night*";  
      };

      let message = `╭═══💠 *VOX-MD BOT* 💠═══╮\n`;  
      message += `┃ 🔓 *MODE:* ${mode.toUpperCase()}\n`;  
      message += `┃ 📝 *PREFIX:* ${prefix}\n`;  
      message += `┃ ⚙️ *COMMANDS:* ${totalCommands}\n`;  
      message += `╰═══〘 *KANAMBO* 〙═══╯\n\n`;  
      message += `✨ ${getGreeting()}, Welcome to *VOX-MD*! 🚀\n`;  

      await client.sendMessage("120363405166148822@g.us", { text: message });  
    }  
  });

  client.ev.on("creds.update", saveCreds);

  client.downloadMediaMessage = async (message) => {   
    let mime = (message.msg || message).mimetype || '';   
    let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0];   
    const stream = await downloadContentFromMessage(message, messageType);   
    let buffer = Buffer.from([]);   
    for await (const chunk of stream) {   
      buffer = Buffer.concat([buffer, chunk]);   
    }   
    return buffer;   
  };
}

app.use(express.static("public"));
app.get("/", (req, res) => res.sendFile(__dirname + "/index.html"));
app.listen(port, () => {});

startVOXMD();