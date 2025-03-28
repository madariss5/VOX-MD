
const fs = require("fs");
const path = require("path");

module.exports = async (m) => {uploadtoimgur}{
  try {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || "";

    if (!mime) {
      throw new Error("✳️ Respond to an image or video.");
    }

    let mediaBuffer = await q.download();
    if (mediaBuffer.length > 10 * 1024 * 1024) {
      throw new Error("✴️ Media size exceeds 10 MB. Please upload a smaller file.");
    }

    let currentModuleDirectory = path.dirname(__filename);
    let tmpDir = path.join(currentModuleDirectory, "../tmp");

    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir);
    }

    let mediaPath = path.join(tmpDir, `media_${Date.now()}.${mime.split("/")[1]}`);
    fs.writeFileSync(mediaPath, mediaBuffer);

    let isImageOrVideo = /image\/(png|jpe?g|gif)|video\/mp4/.test(mime);

    if (isImageOrVideo) {
      let link = await uploadtoimgur(mediaPath);
      const fileSizeMB = (mediaBuffer.length / (1024 * 1024)).toFixed(2);

      m.reply(`✅ *Media Upload Successful*\n♕ *File Size:* ${fileSizeMB} MB\n♕ *URL:* ${link}`);
    } else {
      m.reply(`✳️ ${mediaBuffer.length} Byte(s)\n♕ (Unknown Format)`);
    }

    fs.unlinkSync(mediaPath);
  } catch (error) {
    m.reply(`❌ Error: ${error.message}`);
  }
};
