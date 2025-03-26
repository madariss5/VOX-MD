module.exports = async (context) => {
    const { client, m, text, botname, fetchJson, args } = context;

    if (!text) {
        return m.reply("❌ Please provide a song name to search for lyrics.\n\nUsage:\n- `!lyrics <song name>`\n\nExample:\n- `!lyrics Alan Walker Faded`");
    }

    try {
        const query = encodeURIComponent(text);
        const apiUrl = `https://apidl.asepharyana.cloud/api/search/lyrics?query=${query}`;
        const data = await fetchJson(apiUrl);

        if (data && data.result) {
            let lyrics = "";

            if (typeof data.result === "string") {
                lyrics = data.result; // Direct string response
            } else if (Array.isArray(data.result)) {
                lyrics = data.result.join("\n"); // If lyrics are in array format
            } else if (typeof data.result === "object") {
                lyrics = Object.values(data.result)
                    .filter(value => typeof value === "string") // Only get text values
                    .join("\n"); // Join multiple text values
            }

            if (!lyrics.trim()) {
                return m.reply("⚠️ No lyrics found for the given song.");
            }

            await m.reply(`🎵 **Lyrics for "${text}"**:\n\n${lyrics}`);
        } else {
            m.reply("⚠️ No lyrics found or invalid response from API.");
        }
    } catch (error) {
        m.reply("❌ Something went wrong...\n\n" + error);
    }
};