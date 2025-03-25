module.exports = async (context) => {
    const { client, m, text, botname, fetchJson, args } = context;

    if (!text) {
        return m.reply("Provide a URL or text to summarize.either in BULLET_POINTS,DETAILED_PARAGRAPHS or KEY_TAKEAWAYS but BULLET_POINTS is default");
    }

    // Default style and length
    const style = args[1] && ["BULLET_POINTS", "DETAILED_PARAGRAPHS", "KEY_TAKEAWAYS"].includes(args[1].toUpperCase()) 
        ? args[1].toUpperCase() 
        : "BULLET_POINTS"; // Default to BULLET_POINTS

    try {
        const apiUrl = `https://fastrestapis.fasturl.cloud/aiexperience/summarize?url=${encodeURIComponent(text)}&style=${style}&length=MEDIUM`;
        const data = await fetchJson(apiUrl);

        if (data && data.result) {
            const res = data.result;
            await m.reply(res);
        } else {
            m.reply("Invalid response from API.");
        }
    } catch (error) {
        m.reply("Something went wrong...\n\n" + error);
    }
};