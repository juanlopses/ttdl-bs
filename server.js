const express = require("express");
const cors = require("cors");
const { ttdl } = require("ruhend-scraper");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.post("/api/download", async (req, res) => {
  const { url } = req.body;
  try {
    const canonicalURL = url.includes("/t/") ? await resolveShortURL(url) : url;
    const data = await ttdl(canonicalURL);

    const {
      title,
      author,
      username,
      published,
      like,
      comment,
      share,
      views,
      bookmark,
      video,
      cover,
      music,
      profilePicture
    } = data;

    res.json({
      title,
      author,
      username,
      published,
      like,
      comment,
      share,
      views,
      bookmark,
      video,
      cover,
      music,
      profilePicture
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(400).json({ error: "No se pudo procesar el enlace." });
  }
});

async function resolveShortURL(shortUrl) {
  const response = await fetch(shortUrl, { method: "HEAD", redirect: "follow" });
  return response.url;
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
