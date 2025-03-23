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

module.exports = voxmd = async (client, m, chatUpdate, store) => {
  try {
    if (!m || !m.message) return; // Prevent bot from crashing if m is undefined

    let body =
      m.mtype === "conversation" ? m.message.conversation :
      m.mtype === "imageMessage" ? m.message.imageMessage.caption :
      m.mtype === "extendedTextMessage" ? m.message.extendedTextMessage.text : "";

    let msgDreaded = m.message.extendedTextMessage?.contextInfo?.quotedMessage;
    let budy = typeof m.text == "string" ? m.text : "";

    // Ensure proper bot number recognition
    const botNumber = jidNormalizedUser(client.user.id);
    const itsMe = m.sender === botNumber;
    let text = body.split(" ").slice(1).join(" "); // Extract command arguments
    const cmd = body.startsWith(prefix) ? body.slice(prefix.length).split(" ")[0].toLowerCase() : null;

    // Extract Group Admins
    const getGroupAdmins = (participants) => {
      return participants.filter(i => i.admin === "superadmin" || i.admin === "admin").map(i => i.id);
    };

    const groupMetadata = m.isGroup ? await client.groupMetadata(m.chat).catch(() => { }) : "";
    const groupName = m.isGroup && groupMetadata ? groupMetadata.subject : "";
    const participants = m.isGroup && groupMetadata ? groupMetadata.participants : [];
    const groupAdmin = m.isGroup ? getGroupAdmins(participants) : [];
    const isBotAdmin = m.isGroup ? groupAdmin.includes(botNumber) : false;
    const isAdmin = m.isGroup ? groupAdmin.includes(m.sender) : false;

    const DevDreaded = dev.split(",");
    const Owner = DevDreaded.map(v => v.replace(/[^0-9]/g, "") + "@s.whatsapp.net").includes(m.sender);

    const context = {
      client, m, text, Owner, chatUpdate, store, isBotAdmin, isAdmin, participants,
      body, budy, totalCommands, botNumber, itsMe, fetchJson, exec, getRandom, prefix, cmd, botname
    };

    // 🔥 **Rate Limit Handling** (Fixes 429 Errors)
    if (!itsMe && !Owner) {
      let lastRequest = client.lastRequest || 0;
      let now = Date.now();

      if (now - lastRequest < 5000) { // 2 seconds between requests
        console.log("⏳ Too many requests, slowing down...");
        return;
      }

      client.lastRequest = now;
    }

    // 🔥 **Block Unauthorized Users**
    if (await blocked_users(client, m, cmd)) {
      await m.reply("❌ You are blocked from using bot commands.");
      return;
    }

    // 🔥 **Execute Bot Functions**
    await Promise.all([
      antidel(client, m, antidelete),
      status_saver(client, m, Owner, prefix),
      eval2(client, m, Owner, budy, fetchJson),
      eval(client, m, Owner, budy, fetchJson, store),
      antilink(client, m, isBotAdmin, isAdmin, Owner, body),
      antiviewonce(client, m, antionce),
      gcPresence(client, m, gcpresence),
      antitaggc(client, m, isBotAdmin, itsMe, isAdmin, Owner, body, antitag),
      masterEval(client, m, Owner, budy, fetchJson, store)
    ]);

    // 🔥 **Command Execution**
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

  // 🔥 **Global Error Handling**
  process.on('uncaughtException', function (err) {
    let e = String(err);
    if (e.includes("conflict") || e.includes("not-authorized") || e.includes("Socket connection timeout") || e.includes("rate-overlimit") || e.includes("Connection Closed") || e.includes("Timed Out") || e.includes("Value not found")) {
      return;
    }
    console.error('⚠️ Caught exception: ', err);
  });

  // **Prevent Memory Leaks**
  process.setMaxListeners(50);
};