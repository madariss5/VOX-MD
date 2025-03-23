const {
  BufferJSON, WA_DEFAULT_EPHEMERAL, generateWAMessageFromContent, proto,
  generateWAMessageContent, generateWAMessage, prepareWAMessageMedia, areJidsSameUser,
  getContentType, jidNormalizedUser
} = require("@whiskeysockets/baileys");

const fs = require("fs");
const util = require("util");
const chalk = require("chalk");
const speed = require("performance-now");

const {
  smsg, formatp, tanggal, formatDate, getTime, sleep, clockString,
  fetchJson, getBuffer, jsonformat, generateProfilePicture, parseMention, getRandom, fetchBuffer
} = require('./lib/botFunctions.js');

const { exec, spawn, execSync } = require("child_process");
const { TelegraPh, UploadFileUgu } = require("./lib/toUrl");
const uploadtoimgur = require('./lib/Imgur');
const { readFileSync } = require('fs');

const ytmp3 = require('./lib/ytmp3');
const { commands, aliases, totalCommands } = require('./VoxMdhandler');

const blocked_users = require('./Functions/blocked_users');
const status_saver = require('./Functions/status_saver');
const eval2 = require('./Functions/eval2');
const eval = require('./Functions/eval');
const antiviewonce = require('./Functions/antiviewonce');
const gcPresence = require('./Functions/gcPresence');
const antilink = require('./Functions/antilink');
const antitaggc = require('./Functions/antitag');
const masterEval = require('./Functions/masterEval');
const antidel = require('./Functions/antidelete');

const {
  presence, autoread, botname, mode, prefix, mycode, author, packname,
  dev, gcpresence, antionce, antitag, antidelete
} = require('./settings');

// ✅ Global Request Queue
const requestQueue = [];
let processingRequest = false;

// ✅ Process Requests One by One
const processQueue = async () => {
  if (processingRequest || requestQueue.length === 0) return;

  processingRequest = true;
  const nextRequest = requestQueue.shift();
  await nextRequest();
  processingRequest = false;

  setTimeout(processQueue, 5000); // Delay of 5 seconds before processing next request
};

// ✅ Group Metadata Caching
const groupMetadataCache = {};
const getGroupMetadata = async (client, chatId) => {
  if (!groupMetadataCache[chatId]) {
    groupMetadataCache[chatId] = await client.groupMetadata(chatId);
    setTimeout(() => delete groupMetadataCache[chatId], 30000); // Cache for 30 seconds
  }
  return groupMetadataCache[chatId];
};

// ✅ Spam Detection
const spamTracker = {};

module.exports = voxmd = async (client, m, chatUpdate, store) => {
  requestQueue.push(async () => {
    try {
      if (!m || !m.message) return;

      let body =
        m.mtype === "conversation" ? m.message.conversation :
        m.mtype === "imageMessage" ? m.message.imageMessage.caption :
        m.mtype === "extendedTextMessage" ? m.message.extendedTextMessage.text : "";

      let text = body.split(" ").slice(1).join(" ");
      const cmd = body.startsWith(prefix) ? body.slice(prefix.length).split(" ")[0].toLowerCase() : null;

      const botNumber = jidNormalizedUser(client.user.id);
      const itsMe = m.sender === botNumber;
      const DevDreaded = dev.split(",");
      const Owner = DevDreaded.map(v => v.replace(/[^0-9]/g, "") + "@s.whatsapp.net").includes(m.sender);

      // ✅ Rate Limit Handling (5 seconds per user)
      let now = Date.now();
      if (!itsMe && !Owner) {
        if (!spamTracker[m.sender]) {
          spamTracker[m.sender] = { lastMessage: 0, count: 0 };
        }
        let userSpam = spamTracker[m.sender];

        if (now - userSpam.lastMessage < 5000) {
          userSpam.count += 1;
          if (userSpam.count > 3) { // More than 3 quick messages = Blocked
            console.log("🚨 Possible spam detected from:", m.sender);
            return;
          }
        } else {
          userSpam.count = 0;
        }
        userSpam.lastMessage = now;
      }

      // ✅ Get Group Metadata (Only if in a group)
      const groupMetadata = m.isGroup ? await getGroupMetadata(client, m.chat) : "";
      const groupName = m.isGroup && groupMetadata ? groupMetadata.subject : "";
      const participants = m.isGroup && groupMetadata ? groupMetadata.participants : [];
      const groupAdmin = m.isGroup ? participants.filter(i => i.admin === "superadmin" || i.admin === "admin").map(i => i.id) : [];
      const isBotAdmin = m.isGroup ? groupAdmin.includes(botNumber) : false;
      const isAdmin = m.isGroup ? groupAdmin.includes(m.sender) : false;

      const context = {
        client, m, text, Owner, chatUpdate, store, isBotAdmin, isAdmin, participants,
        body, botNumber, itsMe, fetchJson, exec, getRandom, prefix, cmd, botname
      };

      // ✅ Block Unauthorized Users
      if (await blocked_users(client, m, cmd)) {
        await m.reply("❌ You are blocked from using bot commands.");
        return;
      }

      // ✅ Execute Bot Functions
      await Promise.all([
        antidel(client, m, antidelete),
        status_saver(client, m, Owner, prefix),
        eval2(client, m, Owner, text, fetchJson),
        eval(client, m, Owner, text, fetchJson, store),
        antilink(client, m, isBotAdmin, isAdmin, Owner, body),
        antiviewonce(client, m, antionce),
        gcPresence(client, m, gcpresence),
        antitaggc(client, m, isBotAdmin, itsMe, isAdmin, Owner, body, antitag),
        masterEval(client, m, Owner, text, fetchJson, store)
      ]);

      // ✅ Execute Commands
      const resolvedCommandName = aliases[cmd] || cmd;
      if (commands[resolvedCommandName]) {
        try {
          await commands[resolvedCommandName](context);
        } catch (err) {
          console.error(`❌ Error executing ${resolvedCommandName}:`, err);
        }
      }

    } catch (err) {
      console.error("❌ Bot encountered an error:", util.format(err));
    }
  });

  processQueue();
};

// ✅ Global Error Handling
process.on('uncaughtException', function (err) {
  let e = String(err);
  if (!e.includes("conflict") && !e.includes("not-authorized") && !e.includes("rate-overlimit")) {
    console.error('⚠️ Critical Error:', err);
  }
});

// ✅ Prevent Memory Leaks
process.setMaxListeners(50);