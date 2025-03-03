const axios = require("axios");

module.exports = async (context) => {
    const { client, m, text } = context;

    try {
        // Notify user that the process has started
        await client.sendMessage(m.chat, { 
            text: "📝 *Generating your handwritten note... Please wait!*" 
        });

        // Example input values (You can modify these or take user input)
        const name = "Hikaru";
        const classroom = "XII - Bio A";
        const subject = "Sexual Organs";
        const date = "2025-01-25";
        const content = "The human reproductive organs consist of different systems in both males and females, working together to produce offspring. In males, the primary reproductive organs include the testes, which produce sperm and the hormone testosterone, the epididymis where sperm mature and are stored, the vas deferens which transports sperm to the urethra, and the prostate and seminal vesicles that secrete semen as a medium for sperm. In females, the main reproductive organs include the ovaries, which produce eggs and the hormones estrogen and progesterone, the fallopian tubes that connect the ovaries to the uterus where fertilization typically occurs, the uterus, which serves as the environment for fetal development, and the vagina, which acts as the birth canal and the passage for menstrual blood.";
        const font = "MyHandsareHoldingYou.ttf";
        const format = "png";

        // Construct API URL
        const apiUrl = `https://fastrestapis.fasturl.cloud/tool/texttonote?name=${encodeURIComponent(name)}&classroom=${encodeURIComponent(classroom)}&subject=${encodeURIComponent(subject)}&date=${encodeURIComponent(date)}&content=${encodeURIComponent(content)}&font=${encodeURIComponent(font)}&format=${encodeURIComponent(format)}`;

        // Send the generated note as an image
        await client.sendMessage(
            m.chat,
            {
                image: { url: apiUrl },
                caption: `📖 *Here is your handwritten note:*\n\n📌 *Subject:* ${subject}\n📅 *Date:* ${date}\n\n📝 _Handwritten with love_ 💙`,
            },
            { quoted: m }
        );
    } catch (error) {
        console.error("Handwritten note error:", error.message);
        m.reply("❌ *Failed to generate the handwritten note!*");
    }
};
