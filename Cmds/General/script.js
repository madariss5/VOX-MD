const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

module.exports = async ({ client, m }) => {
    try {
        const repoUrl = 'https://api.github.com/repos/Vox-Net/VOX-MD';
        const response = await fetch(repoUrl);
        if (!response.ok) throw new Error('Failed to fetch repository details');
        const repoData = await response.json();

        // Extract repo details
        const stars = repoData.stargazers_count || '0';
        const forks = repoData.forks_count || '0';
        const owner = repoData.owner?.login || 'Vox-Net';
        const repoLink = repoData.html_url;
        const createdAt = new Date(repoData.created_at).toLocaleDateString('en-GB');
        const updatedAt = new Date(repoData.updated_at).toLocaleDateString('en-GB');

        // **🎨 Fetch a random image from `Voxmdgall`**
        const imgPath = path.join(__dirname, '../../Voxmdgall');
        const images = fs.readdirSync(imgPath).filter(file => file.endsWith('.jpg') || file.endsWith('.png'));
        let messageContent = {};

        if (images.length > 0) {
            const randomImagePath = path.join(imgPath, images[Math.floor(Math.random() * images.length)]);
            const imageBuffer = fs.readFileSync(randomImagePath);

            messageContent = {
                image: imageBuffer,
                caption: `╭━━━〔 *VOX-MD REPOSITORY* 〕━━━✦\n`
                    + `┃ 🔹 *Repository:* [VOX-MD](${repoLink})\n`
                    + `┃ 🌟 *Stars:* ${stars}\n`
                    + `┃ 🍴 *Forks:* ${forks}\n`
                    + `┃ 👑 *Owner:* ${owner}\n`
                    + `┃ 🗓 *Created On:* ${createdAt}\n`
                    + `┃ 🔄 *Last Updated:* ${updatedAt}\n`
                    + `╰━━━━━━━━━━━━━━━━━━━━━✦\n\n`
                    + `_💡 Stay updated with the latest developments!_ 🚀`,
            };
        } else {
            messageContent = {
                text: `⚠️ No images found in *Voxmdgall*\n\n`
                    + `🔹 *Repository:* [VOX-MD](${repoLink})\n`
                    + `🌟 *Stars:* ${stars} | 🍴 *Forks:* ${forks}`,
            };
        }

        await client.sendMessage(m.chat, messageContent, { quoted: m });

    } catch (error) {
        console.error('[❌ ERROR] Fetching repo:', error);
        await client.sendMessage(m.chat, { text: '⚠️ *Error:* Unable to fetch repository details.' }, { quoted: m });
    }
};
