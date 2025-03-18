const {
  proto,
  getContentType,
  jidNormalizedUser,
} = require("@whiskeysockets/baileys");
const { readFileSync, readdirSync } = require("fs");
const path = require("path");

// Function to get a random image from ./Voxmdgall
function getRandomImage() {
  const dir = "./Voxmdgall";
  const files = readdirSync(dir).filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));
  if (files.length === 0) return null;
  const randomFile = files[Math.floor(Math.random() * files.length)];
  return readFileSync(path.join(dir, randomFile));
}

function smsg(conn, m, store) {
  if (!m) return m;
  let M = proto.WebMessageInfo;
  if (m.key) {
    m.id = m.key.id;
    m.isBaileys = m.id.startsWith("BAE5") && m.id.length === 16;
    m.chat = m.key.remoteJid;
    m.fromMe = m.key.fromMe;
    m.isGroup = m.chat.endsWith("@g.us");
    m.sender = jidNormalizedUser((m.fromMe && conn.user.id) || m.participant || m.key.participant || m.chat || "");
    if (m.isGroup) m.participant = jidNormalizedUser(m.key.participant) || "";
  }
  if (m.message) {
    m.mtype = getContentType(m.message);
    m.msg = m.mtype == "viewOnceMessage" ? 
        (m.message[m.mtype] ? m.message[m.mtype].message[getContentType(m.message[m.mtype].message)] : undefined) : 
        m.message[m.mtype];

    m.body =
      m.message.conversation ||
      (m.msg && m.msg.caption) ||
      (m.msg && m.msg.text) ||
      (m.mtype == "listResponseMessage" && m.msg && m.msg.singleSelectReply && m.msg.singleSelectReply.selectedRowId) ||
      (m.mtype == "buttonsResponseMessage" && m.msg && m.msg.selectedButtonId) ||
      (m.mtype == "viewOnceMessage" && m.msg && m.msg.caption) ||
      m.text;

    let quoted = (m.quoted = m.msg.contextInfo ? m.msg.contextInfo.quotedMessage : null);
    m.mentionedJid = m.msg.contextInfo ? m.msg.contextInfo.mentionedJid : [];
    if (m.quoted) {
      let type = getContentType(quoted);
      m.quoted = m.quoted[type];
      if (["productMessage"].includes(type)) {
        type = getContentType(m.quoted);
        m.quoted = m.quoted[type];
      }
      if (typeof m.quoted === "string")
        m.quoted = { text: m.quoted };
      m.quoted.mtype = type;
      m.quoted.id = m.msg.contextInfo.stanzaId;
      m.quoted.chat = m.msg.contextInfo.remoteJid || m.chat;
      m.quoted.isBaileys = m.quoted.id ? m.quoted.id.startsWith("BAE5") && m.quoted.id.length === 16 : false;
      m.quoted.sender = jidNormalizedUser(m.msg.contextInfo.participant);
      m.quoted.fromMe = m.quoted.sender === jidNormalizedUser(conn.user.id);
      m.quoted.text = m.quoted.text || m.quoted.caption || m.quoted.conversation || m.quoted.contentText || m.quoted.selectedDisplayText || m.quoted.title || "";
      m.quoted.mentionedJid = m.msg.contextInfo ? m.msg.contextInfo.mentionedJid : [];
      m.getQuotedObj = m.getQuotedMessage = async () => {
        if (!m.quoted.id) return false;
        let q = await store.loadMessage(m.chat, m.quoted.id, conn);
        return exports.smsg(conn, q, store);
      };
      let vM = (m.quoted.fakeObj = M.fromObject({
        key: {
          remoteJid: m.quoted.chat,
          fromMe: m.quoted.fromMe,
          id: m.quoted.id,
        },
        message: quoted,
        ...(m.isGroup ? { participant: m.quoted.sender } : {}),
      }));

      m.quoted.delete = () => conn.sendMessage(m.quoted.chat, { delete: vM.key });

      m.quoted.copyNForward = (jid, forceForward = false, options = {}) => conn.copyNForward(jid, vM, forceForward, options);

      m.quoted.download = () => conn.downloadMediaMessage(m.quoted);
    }
  }
  if (m.msg.url) m.download = () => conn.downloadMediaMessage(m.msg);
  m.text = m.msg.text || m.msg.caption || m.message.conversation || m.msg.contentText || m.msg.selectedDisplayText || m.msg.title || "";

  // Reply function with footer
m.reply = (text, chatId = m.chat, options = {}) => {
    return conn.sendMessage(chatId, 
      {
        text: `\n${text}\n\n╭═══〘✨ 𝗩𝗢𝗫-𝗠𝗗 ✨〙═══╮\n` +
              `┃ 👤 *𝗔𝘂𝘁𝗵𝗼𝗿:* 𝙆𝘼𝙉𝘼𝙈𝘽𝙊\n` +
              `┃ ⚡ *𝗣𝗼𝘄𝗲𝗿𝗲𝗱 𝗕𝘆:* 𝘾𝗼𝗿𝙥. 𝘝𝙊𝙓𝙉𝙀𝙏.𝙄𝙉𝘾\n` +
              `╰═════════════════╯`,
        contextInfo: {
    externalAdReply: {
        title: `✨ 𝗩𝗢𝗫-𝗠𝗗 𝗕𝗢𝗧 ✨`,
        body: `By KANAMBO 💠`,
        previewType: "NONE",
        thumbnailUrl: "https://chat.whatsapp.com/EZaBQvil8qT9JrI2aa1MAE", // WhatsApp link as thumbnail
        sourceUrl: "https://github.com/Vox-Net/VOX-MD" // Clickable link
    
          }
        }
      }, 
      { quoted: m, ...options }
    );
};

  m.copy = () => exports.smsg(conn, M.fromObject(M.toObject(m)));

  m.copyNForward = (jid = m.chat, forceForward = false, options = {}) => conn.copyNForward(jid, m, forceForward, options);

  return m;
}

module.exports = { smsg };
