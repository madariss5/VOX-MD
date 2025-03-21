const fs = require('fs');
const { session } = require('./settings');

async function authenticationn() {
    try {
        if (!fs.existsSync("./session/creds.json")) {
            console.log("📡 connecting...");
            await fs.writeFileSync("./session/creds.json", atob(session), "utf8");
        }
        else if (fs.existsSync("./session/creds.json") && session != "zokk") {
            await fs.writeFileSync("./session/creds.json", atob(session), "utf8");
        }
    }
    catch (e) {
        console.log("Session is invalid: " + e);
        return;
    }
}

module.exports = authenticationn;
