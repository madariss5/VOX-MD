const axios = require("axios");

module.exports = async (context) => {
    const { client, m, text } = context;

    if (!text) {
        return m.reply(
            "📄 *Enter the text you want to convert to PDF!*\n\n" +
            "✨ *You can also add a title, header, and an optional watermark/logo.*\n\n" +
            "📝 *Example:*\n" +
            "`.textpdf This is an example text | My Title | My Header | https://yourlogo.com/logo.png`\n\n" +
            "💡 *Watermark (logo) is optional. If not provided, it will be skipped.*"
        );
    }

    try {
        // Notify user that the PDF is being generated
        await client.sendMessage(m.chat, {
            text: "📄 *Generating your PDF... Please wait!* ⏳"
        });

        // Split text input into parts
        let [pdfText, title, header, watermark] = text.split("|").map(t => t.trim());

        // Default values if not provided
        title = title || "Document";
        header = header || "This is the header text";
        watermark = watermark ? `&watermark=${encodeURIComponent(watermark)}` : ""; // Only add watermark if provided

        // Construct API URL (without watermark if not provided)
        const apiUrl = `https://fastrestapis.fasturl.cloud/tool/texttopdf?text=${encodeURIComponent(pdfText)}&font=Times-Roman&fontSize=12&align=left&title=${encodeURIComponent(title)}&header=${encodeURIComponent(header)}&footer=Page%201${watermark}&wmSize=30`;

        // Fetch the PDF from the API
        const response = await axios.get(apiUrl, { responseType: "arraybuffer" });

        // Generate filename based on title
        const fileName = `${title.replace(/\s+/g, "_")}.pdf`; // Replace spaces with underscores

        // Send the PDF as a document
        await client.sendMessage(
            m.chat,
            {
                document: Buffer.from(response.data),
                mimetype: "application/pdf",
                fileName: fileName,
                caption: `📄 *PDF Generated!*\n\n📌 *Title:* ${title}\n📝 *Header:* ${header}${watermark ? `\n🖼️ *Watermark:* Yes` : "\n🚫 *No Watermark*"}`
            },
            { quoted: m }
        );

    } catch (error) {
        console.error("PDF generation error:", error.message);
        m.reply("❌ *Failed to generate the PDF!* Please try again later.");
    }
};
