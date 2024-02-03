import { Router } from "express";
const ytdl = require("ytdl-core");

const router = Router();

router.post("/download", async (req, res) => {
  try {
    const url = req.body.url;
    const type = req.body.type;
    if (!ytdl.validateURL(url))
      return res.status(400).json({ message: "Invalid URL", code: 400 });
    if (type !== "mp3" && type !== "mp4")
      return res.status(400).json({ message: "Invalid type", code: 400 });
    res.setHeader("Content-Type", type === "mp3" ? "audio/mpeg" : "video/mp4");
    ytdl(url, {
      format: type,
      filter: type == "mp4" ? "videoandaudio" : "audioonly",
    }).pipe(res);
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
