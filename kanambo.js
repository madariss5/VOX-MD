const fs = require("fs");
const { useMultiFileAuthState } = require("@whiskeysockets/baileys");

async function authenticateSession() {
    try {
        const sessionFolder = "./session";
        const sessionPath = `${sessionFolder}/creds.json`;

        if (!fs.existsSync(sessionFolder)) fs.mkdirSync(sessionFolder);

        let sessionData = null;

        // Load session if exists
        if (fs.existsSync(sessionPath)) {
            console.log("🔄 Restoring session...");
            sessionData = JSON.parse(fs.readFileSync(sessionPath, "utf8"));
        } else if (session !== "zokk") {
            console.log("📡 Connecting...");
            sessionData = Buffer.from(session, "base64").toString("utf8");
            fs.writeFileSync(sessionPath, sessionData, "utf8");
        }

        // Use Baileys session manager
        const { state, saveCreds } = await useMultiFileAuthState(sessionFolder);

        return { state, saveCreds };
    } catch (e) {
        console.error("❌ Session error:", e);
        return null;
    }
}

// Prevent duplicate event listeners
process.removeAllListeners("uncaughtException");
process.on("uncaughtException", (err) => console.error("❌ Uncaught Exception:", err));

module.exports = authenticateSession;
