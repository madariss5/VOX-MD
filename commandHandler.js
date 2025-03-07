const fs = require('fs');
const path = require('path');

const cmdsDir = path.join(__dirname, 'Cmds');


function findAllCommandFiles(dir) {
    let commandFiles = [];
    let totalCommands = 0;

    function findFiles(directory) {
        const files = fs.readdirSync(directory);

        for (const file of files) {
            const filePath = path.join(directory, file);
            const stat = fs.statSync(filePath);

            if (stat.isDirectory()) {
                findFiles(filePath);
            } else if (file.endsWith('.js')) {
                commandFiles.push(filePath);
                totalCommands++;
            }
        }
    }

    findFiles(dir);
    return { commandFiles, totalCommands };
}

const { commandFiles, totalCommands } = findAllCommandFiles(cmdsDir);


const commands = {};
const aliases = {
    speed: "ping", 
kick: "remove",
mute: "close", 
unmute: "open", 
    latency: "ping", 
    runtime: "uptime",
admin: "oadmin", 
groups: "botgc",
bc: "broadcast", 
pp: "fullpp",  
kickall: "kill",
kickall2: "kill2", 
exec: "shell", 
leave: "leavegc",
left: "leavegc",
join: "joingc",
gh: "github",
ss: "screenshot", 
ssweb: "ssweb",
help: "menu",
commands: "menu",
list: "menu",
repo: "script",
sc: "script",
linkgc: "link",
gclink: "link",
grouplink: "link",
linkgroup: "link",
mention: "tagall", 
vv: "retrieve", 
reset: "revoke",
mute: "close", 
app: "apk",
fb: "fbdl", 
facebook: "fbdl",
url: "upload", 
tourl: "upload", 
yta: "ytmp3",
ytv: "ytmp4", 
mf: "mediafire",
emojimix: "emix",  
enc: "encrypt",
req: "requests",
approve: "approve-all",
reject: "reject-all",                        
    up: "uptime" 
};


commandFiles.forEach((file) => {
    const commandName = path.basename(file, '.js');
    const commandModule = require(file);

   
    commands[commandName] = commandModule;
});

module.exports = { commands, aliases, totalCommands };

const { connectBot } = require(path.join(__dirname, "connect.js"));

commands["connectbot"] = {
    name: "connectbot",
    description: "Connect a bot using Base64 session data",
    execute: async (client, message, args) => {
        try {
            if (!args[0]) {
                return client.sendMessage(message.chat, { text: "⚠️ *Usage:* `.connectbot [Base64_Session]`" });
            }

            let base64Session = args[0];

            // Validate if it's Base64
            if (!/^([A-Za-z0-9+/=]+)$/.test(base64Session)) {
                return client.sendMessage(message.chat, { text: "❌ Invalid session format! Ensure it's a valid Base64 string." });
            }

            console.log("⚡ .connectbot command detected! Attempting to connect...");

            await connectBot(base64Session, client);
        } catch (err) {
            console.error("❌ Error in .connectbot command:", err);
            client.sendMessage(message.chat, { text: "❌ Failed to connect bot. Check logs." });
        }
    }
};
