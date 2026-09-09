const posts = [
  "https://www.instagram.com/p/Dbnqaqtk9hS/",
  "https://www.instagram.com/reel/DbUOUBHPjhj/",
];

for (const postUrl of posts) {
  const shortcode = postUrl.match(/\/(p|reel|reels)\/([^/]+)/i)?.[2];
  const endpoints = [
    `https://www.instagram.com/p/${shortcode}/?__a=1&__d=dis`,
    `https://www.instagram.com/api/v1/media/shortcode/${shortcode}/info/`,
    `https://www.instagram.com/p/${shortcode}/embed/captioned/`,
  ];

  console.log("\n===", postUrl, "===");

  for (const endpoint of endpoints) {
    try {
      const res = await fetch(endpoint, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
          "X-IG-App-ID": "936619743392459",
          "X-Requested-With": "XMLHttpRequest",
          Accept: "*/*",
        },
      });
      const text = await res.text();
      const hasCarousel = text.includes("carousel_media");
      const hasVideo = text.includes("video_versions");
      const cdnCount = (text.match(/scontent\.cdninstagram\.com/g) ?? []).length;
      console.log(endpoint.split("/").slice(-2).join("/"), res.status, {
        len: text.length,
        carousel: hasCarousel,
        video: hasVideo,
        cdn: cdnCount,
      });
    } catch (error) {
      console.log(endpoint, "error", error.message);
    }
  }
}
