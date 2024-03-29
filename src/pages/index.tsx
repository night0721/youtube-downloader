import React, { useState } from "react";
import Head from "next/head";
import { FiDownloadCloud } from "react-icons/fi";
import download from "downloadjs";

export default function Home() {
  const [url, setUrl] = useState("");
  const [info, setInfo] = useState("");

  const getTitle = async (videoID: string) => {
    const youtubeAPI = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoID}&fields=items(id%2Csnippet)&key=AIzaSyB8Fk-MWT_r8nVgG35gIZoP-DhJYpJ_tZ0`;
    const response = await fetch(youtubeAPI).then(res => res.json());
    return response.items[0].snippet.title;
  };

  const getVideoID = (url: string) => {
    if (url.match(/watch/)) {
      return url.split("/")[3].split("?")[1].split("=")[1];
    } else if (url.match(/youtu.be/)) {
      const videoID = url != "" && url.split("/")[3];
      return videoID;
    }
  };

  const handle = async (type: string) => {
    const videoID = getVideoID(url);
    setInfo("Processing the video...");
    if (videoID) {
      const title = await getTitle(videoID);
      try {
        fetch("https://service-api.night0721.repl.co/api/download", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url, type }),
        })
          .then(res => res.blob())
          .then(async blob => {
            const sizeInBytes = blob.size;
            if (sizeInBytes <= 0) {
              setInfo(
                "Unable to download! Maybe File size is too high. Try to download video less than 5MB"
              );
            } else {
              download(
                blob,
                `${title}.${type}`,
                type === "mp3" ? "audio/mpeg" : "video/mp4"
              );
              setInfo("Ready for download!");
            }
          });
      } catch (err) {
        console.error(err);
        setInfo(
          "Unable to download! Maybe File size is too high. Try to download video less than 5MB"
        );
      }
    } else {
      setInfo("Invalid URL");
    }
  };

  return (
    <div>
      <Head>
        <title>Youtube Downloader</title>
        <link
          rel="shortcut icon"
          href="https://www.youtube.com/s/desktop/066935b0/img/favicon.ico"
          type="image/x-icon"
        />
      </Head>

      <div className="py-12 w-full  h-screen">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 w-full relative top-1/4">
          <h3 className="text-4xl flex justify-center">
            {" "}
            <FiDownloadCloud /> &nbsp; Youtube Downloader{" "}
          </h3>
          <h4 className="text-xs py-1 flex justify-center">
            {" "}
            Sample video link : https://youtu.be/videoID{" "}
          </h4>
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg w-full">
            <div className="p-6 bg-white border-b border-gray-200 flex justify-center w-full">
              <div className="flex w-4/5">
                <input
                  type="text"
                  className="border-2 m-1.5 border-gray-300 p-2 w-full"
                  name="title"
                  id="title"
                  value={url}
                  onChange={e => {
                    setInfo("");
                    setUrl(e.target.value);
                  }}
                  placeholder="Paste the valid youtube link"
                  required
                ></input>
              </div>
            </div>
            <div className="p-3 flex w-full justify-center">
              <button
                className="p-3 m-1.5 flex w-56 justify-center bg-blue-900 text-white hover:bg-blue-600"
                onClick={() => handle("mp3")}
              >
                Download mp3
              </button>
              <button
                className="p-3 m-1.5 flex w-48 justify-center bg-blue-900 text-white hover:bg-blue-600"
                onClick={() => handle("mp4")}
              >
                Download mp4
              </button>
            </div>
          </div>
          {info && <h3 className="flex justify-center p-3 m-1.5 "> {info} </h3>}
        </div>
      </div>
    </div>
  );
}
