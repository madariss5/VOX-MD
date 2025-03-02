/* VOX-MD - The Modern WhatsApp Bot */

const { default: VOXMDConnect, useMultiFileAuthState, DisconnectReason, makeInMemoryStore, downloadContentFromMessage, jidDecode } = require("@whiskeysockets/baileys");
const pino = require("pino");
const { Boom } = require("@hapi/boom");
const fs = require("fs");
const FileType = require("file-type");
const express = require("express");
const { execSync } = require("child_process");
const { DateTime } = require('luxon');
const chalk = require("chalk");

const app = express();
const port = process.env.PORT || 10000;
const store = makeInMemoryStore({ logger: pino().child({ level: "silent" }) });

const authenticationn = require('./auth.js');
const { smsg } = require('./smsg');
const { autoview, autoread, botname, autobio, mode, prefix, autolike } = require('./settings');
const { commands, totalCommands } = require('./commandHandler');
const groupEvents = require("./groupEvents.js");

authenticationn();

async function startVOXMD() {
    const { saveCreds, state } = await useMultiFileAuthState("session");
    const client = VOXMDConnect({
        logger: pino({ level: 'silent' }),
        printQRInTerminal: true,
        version: [2, 3000, 1015901307],
        browser: ["VOX-MD", 'Safari', '3.0'],
        auth: state
    });

    store.bind(client.ev);  
    setInterval(() => store.writeToFile("store.json"), 3000);  

    if (autobio === 'true') {  
        setInterval(() => {  
            const date = new Date();  
            client.updateProfileStatus(  
                `⚡ ${botname} is active 24/7 ⚡\n📅 ${date.toLocaleString('en-US', { timeZone: 'Africa/Nairobi', weekday: 'long' })}`  
            );  
        }, 10 * 1000);  
    }  

    client.ev.on("messages.upsert", async (chatUpdate) => {  
        try {  
            let mek = chatUpdate.messages[0];  
            if (!mek.message) return;  

            mek.message = mek.message.ephemeralMessage ? mek.message.ephemeralMessage.message : mek.message;  
            if (autoview === 'true' && mek.key && mek.key.remoteJid === "status@broadcast") {  
                await client.readMessages([mek.key]);  
            }  
            if (autoread === 'true' && mek.key && mek.key.remoteJid.endsWith('@s.whatsapp.net')) {  
                await client.readMessages([mek.key]);  
            }  

            const ownerNumber = "254114148625@s.whatsapp.net"; // Change to your number

            if (mode.toLowerCase() === "private" && !mek.key.fromMe && mek.sender !== ownerNumber) return;
            let m = smsg(client, mek, store);
            require("./dreaded")(client, m, chatUpdate, store);
        } catch (err) {
            console.log(err);
        }
    });

    client.ev.on("connection.update", async (update) => {  
        const { connection, lastDisconnect } = update;  

        if (connection === "open") {  
            await client.groupAcceptInvite("JXIs0m622UHJtN1HoXSnQ3");  
            console.log(chalk.greenBright(`✅ Connection successful!\nLoaded ${totalCommands} commands.\nVOX-MD is active.`));  

            const getGreeting = () => {  
                const currentHour = DateTime.now().setZone('Africa/Nairobi').hour;  
                if (currentHour >= 5 && currentHour < 12) return '🌄 *Good Morning*';  
                if (currentHour >= 12 && currentHour < 18) return '☀️ *Good Afternoon*';  
                if (currentHour >= 18 && currentHour < 22) return '🌆 *Good Evening*';  
                return '🌙 *Good Night*';  
            };  

            const getCurrentTimeInNairobi = () => DateTime.now().setZone('Africa/Nairobi').toFormat("hh:mm a");  

            let message = `╭═══💠 *VOX-MD BOT* 💠═══╮\n`;  
            message += `┃   _*BOT STATUS*_: Online✅\n`;  
            message += `┃ 🔓 *MODE:* ${mode.toUpperCase()}\n`;  
            message += `┃ 📝 *PREFIX:* ${prefix}\n`;  
            message += `┃ ⚙️ *COMMANDS:* ${totalCommands}\n`;  
            message += `┃ ⏳ *TIME:* ${getCurrentTimeInNairobi()}\n`;  
            message += `┃ 📡 *LIBRARY:* Baileys\n`;  
            message += `╰═══〘 *KANAMBO* 〙═══╯\n\n`;  

            message += `✨ ${getGreeting()}, Welcome to *VOX-MD*! 🚀\n`;  
            message += `🔥 Stay tuned for powerful features & updates!\n\n`;  

            message += `╭───────────────╮\n`;  
            message += `│   ⚡ *POWERED BY*  │\n`;  
            message += `│   🌐 *©VOXNET.INC*   │\n`;  
            message += `╰───────────────╯\n`;  

            await client.sendMessage('254114148625@s.whatsapp.net', { text: message });  
        } else if (connection === "close") {  
            let reason = new Boom(lastDisconnect?.error)?.output.statusCode;  
            if (reason === DisconnectReason.badSession) {  
                console.log(`❌ Bad Session. Delete session and scan again.`);  
                process.exit();  
            } else if (reason === DisconnectReason.connectionClosed) {  
                console.log("🔄 Connection closed, reconnecting....");  
                startVOXMD();  
            } else if (reason === DisconnectReason.connectionLost) {  
                console.log("⚠️ Connection lost. Reconnecting...");  
                startVOXMD();  
            } else if (reason === DisconnectReason.connectionReplaced) {  
                console.log("⚠️ Session replaced. Restarting bot.");  
                process.exit();  
            } else if (reason === DisconnectReason.loggedOut) {  
                console.log(`🚨 Device logged out. Delete session and scan again.`);  
                process.exit();  
            } else if (reason === DisconnectReason.restartRequired) {  
                console.log("🔄 Restart required. Restarting...");  
                startVOXMD();  
            } else if (reason === DisconnectReason.timedOut) {  
                console.log("⏳ Connection timed out. Reconnecting...");  
                startVOXMD();  
            } else {  
                console.log(`⚠️ Unknown error: ${reason}`);  
                startVOXMD();  
            }  
        }  
    });  

    client.ev.on("creds.update", saveCreds);
}

app.use(express.static('public'));
app.get("/", (req, res) => res.sendFile(__dirname + '/index.html'));
app.listen(port, () => console.log(`🚀 Server listening on: http://localhost:${port}`));

startVOXMD();

let file = require.resolve(__filename);
fs.watchFile(file, () => {
    fs.unwatchFile(file);
    console.log(chalk.redBright(`♻️ Updating ${__filename}`)); // FIXED SYNTAX ERROR
    delete require.cache[file];
    require(file);
});
