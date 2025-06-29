function formatNumber(num) {
  if (num >= 1e9) return (num / 1e9).toFixed(1) + "B";
  if (num >= 1e6) return (num / 1e6).toFixed(1) + "M";
  if (num >= 1e3) return (num / 1e3).toFixed(1) + "K";
  return num;
}

async function downloadVideo() {
  const urlInput = document.getElementById("tiktok-url");
  const url = urlInput.value.trim();
  const loading = document.getElementById("loading");
  const result = document.getElementById("result");
  const errorMsg = document.getElementById("error-message");

  loading.classList.remove("hidden");
  result.classList.add("hidden");
  errorMsg.classList.add("hidden");

  try {
    const res = await fetch("/api/download", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url })
    });

    if (!res.ok) throw new Error("Error al procesar la URL");

    const data = await res.json();

    document.getElementById("video-player").src = data.video;
    document.getElementById("video-title").textContent = data.title;
    document.getElementById("video-author").textContent = `Por @${data.username}`;
    document.getElementById("published").textContent = data.published;
    document.getElementById("likes").textContent = formatNumber(data.like);
    document.getElementById("comments").textContent = formatNumber(data.comment);
    document.getElementById("shares").textContent = formatNumber(data.share);
    document.getElementById("views").textContent = formatNumber(data.views);
    document.getElementById("bookmarks").textContent = formatNumber(data.bookmark);

    document.getElementById("download-video").onclick = () => window.open(data.video);
    document.getElementById("download-audio").onclick = () => window.open(data.music);

    result.classList.remove("hidden");
  } catch (err) {
    errorMsg.textContent = err.message;
    errorMsg.classList.remove("hidden");
  } finally {
    loading.classList.add("hidden");
  }
}
