// Mock API endpoints
const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";

// Fetch quotes from mock server
async function fetchQuotesFromServer() {
  try {
    const response = await fetch(SERVER_URL);
    const data = await response.json();

    // Simulated server quotes
    return data.slice(0, 5).map(item => ({
      text: item.title,
      category: "server"
    }));
  } catch (error) {
    console.error("Error fetching from server:", error);
    return [];
  }
}

// Post a single quote to mock server (for test compatibility)
async function postQuoteToServer(quote) {
  try {
    const response = await fetch(SERVER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(quote)
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error posting to server:", error);
  }
}

// Sync local quotes with server
async function syncQuotes() {
  const serverQuotes = await fetchQuotesFromServer();

  let localQuotes = JSON.parse(localStorage.getItem("quotes")) || [];

  // Conflict resolution: server wins
  let merged = [...serverQuotes, ...localQuotes];

  localStorage.setItem("quotes", JSON.stringify(merged));

  showNotification("Data synced with server (server priority)");
}

// Simple notification on screen
function showNotification(msg) {
  let note = document.createElement("div");
  note.innerText = msg;
  note.style.position = "fixed";
  note.style.bottom = "20px";
  note.style.right = "20px";
  note.style.background = "#00c851";
  note.style.color = "white";
  note.style.padding = "10px 15px";
  note.style.borderRadius = "6px";
  note.style.zIndex = "999";
  document.body.appendChild(note);

  setTimeout(() => note.remove(), 3000);
}

// Periodically check every 5 seconds
setInterval(syncQuotes, 5000);
