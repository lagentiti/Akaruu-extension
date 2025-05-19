chrome.storage.local.get("isLive", (result) => {
  const isLive = result.isLive;
  const el1 = document.getElementById("dgad");
  const el2 = document.getElementById("dgad2");

  if (isLive) {
    if (el1) el1.innerText = "EN LIGNE";
    if (el2) el2.style.backgroundColor = "green";
  } else {
    if (el1) el1.innerText = "Hors-ligne";
  }
});

chrome.runtime.onMessage.addListener((message) => {
  const el1 = document.getElementById("dgad");
  const el2 = document.getElementById("dgad2");

  if (message.action === "setOnlineStatus") {
    if (el1) el1.innerText = "EN LIGNE";
    if (el2) el2.style.backgroundColor = "green";
  } else if (message.action === "setOfflineStatus") {
    if (el1) el1.innerText = "Hors-ligne";
  }
});
