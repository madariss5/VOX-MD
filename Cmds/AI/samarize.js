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

        // Extract summary correctly
        if (data && data.result && typeof data.result === "object") {
            const summary = Object.values(data.result).join("\n"); // Convert object values to a readable format
            await m.reply(`✅ **Summary (${style.replace("_", " ")})**:\n\n${summary}`);
        } else {
            m.reply("⚠️ Invalid response from API.");
        }
    } catch (error) {
        m.reply("❌ Something went wrong...\n\n" + error);
    }
};