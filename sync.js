async function fetchQuotesFromServer() {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts");
  const data = await response.json();

  return data.slice(0, 5).map(post => ({
    text: post.title,
    category: "server"
  }));
}

async function postQuoteToServer(quote) {
  return fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(quote)
  });
}

async function syncQuotes() {
  try {
    const serverQuotes = await fetchQuotesFromServer();

    const localQuotes = JSON.parse(localStorage.getItem("quotes")) || [];

    const mergedQuotes = [...serverQuotes, ...localQuotes];

    localStorage.setItem("quotes", JSON.stringify(mergedQuotes));

    const notify = document.createElement("div");
    notify.innerText = "Quotes synced with server!";
    notify.style.background = "#d1ffd1";
    notify.style.padding = "10px";
    notify.style.marginTop = "10px";

    document.body.appendChild(notify);

    setTimeout(() => notify.remove(), 3000);

  } catch (error) {
    console.error("Sync failed:", error);
  }
}

setInterval(syncQuotes, 10000);
