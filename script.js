let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "Believe in yourself", category: "motivation" },
  { text: "Dream big, work hard", category: "motivation" },
  { text: "Life is short, smile while you can", category: "life" }
];

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

const quoteDisplay = document.getElementById("quoteDisplay");

document.getElementById("newQuoteBtn").addEventListener("click", () => {
  const r = Math.floor(Math.random() * quotes.length);
  const q = quotes[r];
  quoteDisplay.innerText = q.text;
  sessionStorage.setItem("lastViewedQuote", q.text);
});

function addQuote() {
  const input = document.getElementById("quoteInput");
  if (input.value.trim() === "") return;

  quotes.push({ text: input.value, category: "custom" });
  saveQuotes();
  input.value = "";
  alert("Quote added!");
}

function exportToJson() {
  const data = JSON.stringify(quotes, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();

  URL.revokeObjectURL(url);
}

function importFromJsonFile(event) {
  const reader = new FileReader();

  reader.onload = function (e) {
    try {
      const imported = JSON.parse(e.target.result);
      quotes.push(...imported);
      saveQuotes();
      alert("Quotes imported successfully!");
    } catch (error) {
      alert("Invalid JSON file");
    }
  };

  reader.readAsText(event.target.files[0]);
}

async function fetchQuotesFromServer() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const data = await response.json();
    return data.slice(0, 5).map(item => ({
      text: item.title,
      category: "server"
    }));
  } catch (error) {
    console.error("Error fetching from server:", error);
    return [];
  }
}

async function postQuoteToServer(quote) {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(quote)
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error posting to server:", error);
  }
}

async function syncQuotes() {
  try {
    const serverQuotes = await fetchQuotesFromServer();
    let localQuotes = JSON.parse(localStorage.getItem("quotes")) || [];
    const merged = [...serverQuotes, ...localQuotes];
    localStorage.setItem("quotes", JSON.stringify(merged));
    quotes = merged;
    showNotification("Quotes synced with server!");
  } catch (error) {
    console.error("Sync failed:", error);
  }
}

function showNotification(message) {
  const notification = document.createElement("div");
  notification.innerText = message;
  notification.style.position = "fixed";
  notification.style.bottom = "20px";
  notification.style.right = "20px";
  notification.style.backgroundColor = "#4CAF50";
  notification.style.color = "white";
  notification.style.padding = "15px 20px";
  notification.style.borderRadius = "5px";
  notification.style.zIndex = "1000";
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 3000);
}

setInterval(syncQuotes, 30000);
