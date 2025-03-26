module.exports = async (context) => {
    const { client, m, text, botname, fetchJson } = context;

    if (!text) {
        return m.reply("Provide a valid YouTube link for download");
    }

    try {
        // Replace API URL with the new one
        const apiUrl = `https://fastrestapis.fasturl.cloud/downup/ytmp4?url=${encodeURIComponent(text)}&quality=480&server=auto`;
        const data = await fetchJson(apiUrl);

        // Validate API response
        if (!data || data.status !== 200 || !data.result || !data.result.videoUrl) {
            return m.reply("We are sorry, but the API endpoint didn't respond correctly. Try again later.");
        }

        const videoUrl = data.result.videoUrl;

        // Send video
        await client.sendMessage(
            m.chat,
            {
                video: { url: videoUrl },
                caption: `Downloaded by ${botname}`,
                gifPlayback: false,
            },
            { quoted: m }
        );
    } catch (e) {
        m.reply("An error occurred. The API might be down.\n" + e);
    }
};