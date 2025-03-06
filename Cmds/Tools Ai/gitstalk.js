const axios = require("axios");

module.exports = async (context) => {
    const { client, m, text } = context;

    if (!text) {
        return m.reply("🔍 *Enter a GitHub username to stalk!*\n\nExample:\n`.githubstalk Kanambo`");
    }

    try {
        // Notify user that the search is in progress
        await client.sendMessage(m.chat, {
            text: "🔎 *Fetching GitHub profile... Please wait!* ⏳"
        });

        // API request
        const apiUrl = `https://fastrestapis.fasturl.cloud/stalk/github?username=${encodeURIComponent(text)}`;
        const response = await axios.get(apiUrl);
        const { data, readme } = response.data.result || {};

        if (!data) {
            return m.reply("❌ *No GitHub profile found!* Try searching for another username.");
        }

        // Extract user details
        const {
            login, name, avatar_url, html_url, company, blog, location, bio, twitter_username,
            public_repos, public_gists, followers, following, created_at, repositories
        } = data;

        // Format top repositories
        let repoText = "";
        if (repositories && repositories.length > 0) {
            const topRepos = repositories.slice(0, 5); // Limit to 5 repos
            repoText = "\n📂 *Top Repositories:*\n";
            topRepos.forEach(repo => {
                repoText += `🔹 *${repo.name}* (${repo.language || "Unknown"})\n` +
                    `   ⭐ ${repo.stargazers_count} | 📝 ${repo.open_issues_count}\n` +
                    `   ${repo.description ? `📌 ${repo.description}` : ""}\n\n`;
            });
        }

        // Format GitHub profile message
        const profileMessage = `✨ *GitHub Profile Stalker* ✨\n\n` +
            `👤 *Username:* ${login}\n` +
            `📛 *Name:* ${name || "N/A"}\n` +
            `🏢 *Company:* ${company || "N/A"}\n` +
            `📌 *Bio:* ${bio || "No bio available"}\n\n` +
            `📂 *Public Repos:* ${public_repos} | 📌 *Public Gists:* ${public_gists}\n` +
            `👥 *Followers:* ${followers} | 🔄 *Following:* ${following}\n\n` +
            `📍 *Location:* ${location || "Unknown"}\n` +
            `🌐 *Website:* ${blog ? `[Visit](${blog})` : "N/A"}\n` +
            `🐦 *Twitter:* ${twitter_username ? `[@${twitter_username}](https://twitter.com/${twitter_username})` : "N/A"}\n` +
            `📅 *Joined GitHub:* ${new Date(created_at).toDateString()}\n` +
            `🔗 *GitHub Profile:* [Click Here](${html_url})\n\n` +
            repoText +
            `✨ _Powered by VOX-MD_`;

        // Send GitHub profile image with details
        await client.sendMessage(
            m.chat,
            {
                image: { url: avatar_url },
                caption: profileMessage
            },
            { quoted: m }
        );

        // Send README if available
        if (readme) {
            await client.sendMessage(m.chat, { text: `📖 *GitHub README:* \n\n${readme.substring(0, 4000)}` }, { quoted: m });
        }

    } catch (error) {
        console.error("GitHub stalk error:", error.message);
        m.reply("❌ *Failed to fetch the GitHub profile!* Please try again later.");
    }
};
