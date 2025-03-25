module.exports = async (context) => {
    const { client, m, text, botname, fetchJson, args } = context;

    if (!text) {
        return m.reply("❌ Please provide a URL or text to summarize.\n\nUsage:\n- `!summarize <url or text> [style]`\n\nAvailable styles:\n🔹 BULLET_POINTS (default)\n🔹 DETAILED_PARAGRAPHS\n🔹 KEY_TAKEAWAYS");
    }

    // Extract user-selected style or default to BULLET_POINTS
    const style = args[1] && ["BULLET_POINTS", "DETAILED_PARAGRAPHS", "KEY_TAKEAWAYS"].includes(args[1].toUpperCase()) 
        ? args[1].toUpperCase() 
        : "BULLET_POINTS"; // Default to BULLET_POINTS

    try {
        const apiUrl = `https://fastrestapis.fasturl.cloud/aiexperience/summarize?url=${encodeURIComponent(text)}&style=${style}&length=MEDIUM`;
        const data = await fetchJson(apiUrl);

        if (data && data.result) {
            let summary = "";

            if (typeof data.result === "string") {
                summary = data.result; // Direct string response
            } else if (Array.isArray(data.result)) {
                summary = data.result.join("\n"); // Array of summary points
            } else if (typeof data.result === "object") {
                summary = Object.values(data.result)
                    .filter(value => typeof value === "string") // Only get text values
                    .join("\n"); // Join multiple text values
            }

            if (!summary.trim()) {
                return m.reply("⚠️ API response was empty or invalid.");
            }

            await m.reply(`✅ **Summary (${style.replace("_", " ")})**:\n\n${summary}`);
        } else {
            m.reply("⚠️ Invalid response from API.");
        }
    } catch (error) {
        m.reply("❌ Something went wrong...\n\n" + error);
    }
};