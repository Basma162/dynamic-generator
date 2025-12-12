// This file can contain additional sync-related utilities if needed
// Main sync functionality is in script.js for test compatibility

// Optional: Add manual sync button functionality
document.addEventListener('DOMContentLoaded', () => {
  // Create a manual sync button
  const syncButton = document.createElement('button');
  syncButton.id = 'syncButton';
  syncButton.innerText = 'Sync Now';
  syncButton.style.marginLeft = '10px';
  syncButton.onclick = () => {
    if (typeof syncQuotes === 'function') {
      syncQuotes();
    }
  };
  
  // Add the sync button to the page
  const buttonContainer = document.querySelector('div');
  if (buttonContainer) {
    buttonContainer.appendChild(syncButton);
  }
});
