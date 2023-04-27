import type { NextApiRequest, NextApiResponse } from "next";
const ytdl = require("ytdl-core");

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const url = req.body.url;
      const type = req.body.type;
      if (!ytdl.validateURL(url))
        return res.status(400).json({ message: "Invalid URL", code: 400 });
      if (type !== "mp3" && type !== "mp4")
        return res.status(400).json({ message: "Invalid type", code: 400 });
      res.setHeader(
        "Content-Type",
        type === "mp3" ? "audio/mpeg" : "video/mp4"
      );
      await ytdl(url, {
        format: type,
        filter: type == "mp4" ? "videoandaudio" : "audioonly",
      }).pipe(res);
    } catch (e) {
      console.log(e);
    }
  } else {
    res.status(405).json({ message: "Method not allowed", code: 405 });
  }
}

export const config = {
  api: {
    responseLimit: false,
  },
};
