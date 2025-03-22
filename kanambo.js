const fs = require('fs');
const { session } = require('./settings');

async function authenticateSession() {
    try {
        const sessionPath = "./session/creds.json";

        if (!fs.existsSync("./session")) {  
            fs.mkdirSync("./session");  
        }  

        if (!fs.existsSync(sessionPath) && session !== "zokk") {  
            const sessionData = Buffer.from(session, "base64").toString("utf8");  
            fs.writeFileSync(sessionPath, sessionData, "utf8");  
        }  
    } catch (e) {  
        // Handle errors silently or log them elsewhere if needed
    }
}

authenticateSession();

module.exports = authenticateSession; 