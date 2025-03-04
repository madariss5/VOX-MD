const axios = require("axios");

module.exports = async (context) => {
    const { client, m, text } = context;

    if (!text) {
        return m.reply("🔍 *Enter a GitHub username to stalk!*\n\nExample:\n`.gitstalk Kanambp`");
    }

    try {
        // Notify user that the search is in progress
        await client.sendMessage(m.chat, {
            text: "🔎 *Fetching GitHub profile... Please wait!* ⏳"
        });

        // API request
        const apiUrl = `https://api.ryzendesu.vip/api/stalk/github?username=${encodeURIComponent(text)}`;
        const response = await axios.get(apiUrl);

        // Check if response is not 200
        if (response.status !== 200 || !response.data.login) {
            return m.reply("❌ *No GitHub profile found!* Try searching for another username.");
        }

        // Extract user details
        const {
            login, name, avatar_url, html_url, company, bio, public_repos, public_gists,
            followers, following, created_at, updated_at
        } = response.data;

        // Format GitHub profile message
        const profileMessage = `✅ *Server Response: 200 OK*\n\n` +
            `🔍 *GitHub Profile Found!*\n\n` +
            `👤 *Username:* ${login}\n` +
            `📛 *Name:* ${name || "N/A"}\n` +
            `🏢 *Company:* ${company || "N/A"}\n` +
            `📜 *Bio:* ${bio || "N/A"}\n\n` +
            `📂 *Public Repos:* ${public_repos}\n` +
            `📌 *Public Gists:* ${public_gists}\n` +
            `👥 *Followers:* ${followers} | 🔗 *Following:* ${following}\n\n` +
            `📅 *Account Created:* ${new Date(created_at).toDateString()}\n` +
            `🔄 *Last Updated:* ${new Date(updated_at).toDateString()}\n\n` +
            `🔗 *GitHub Profile:* [View Here](${html_url})\n\n✨ _Powered by VOX-MD_`;

        // Send GitHub profile image with details
        await client.sendMessage(
            m.chat,
            {
                image: { url: avatar_url },
                caption: profileMessage
            },
            { quoted: m }
        );

    } catch (error) {
        console.error("GitHub stalk error:", error.message);
        m.reply("❌ *Failed to fetch the GitHub profile!* Please try again later.");
    }
};
