const STREAMER_NAME = "Akaruu";
const CLIENT_ID = "i7yk2ezzdv2lxk14j749sev4gqchon";
const CLIENT_SECRET = "yrnm4qq3gdvyvukowngs7pjtn1rhcx";
const twitchNotificationId = "twitch_live";

let accessToken = "";
let isLive = false;

async function getAccessToken() {
  const response = await fetch("https://id.twitch.tv/oauth2/token", {
    method: "POST",
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: "client_credentials"
    })
  });
  const data = await response.json();
  accessToken = data.access_token;
}

async function checkStreamerAndNotify() {
  if (!accessToken) await getAccessToken();

  const url = `https://api.twitch.tv/helix/streams?user_login=${STREAMER_NAME}`;

  try {
    const response = await fetch(url, {
      headers: {
        "Client-ID": CLIENT_ID,
        "Authorization": `Bearer ${accessToken}`
      }
    });

    if (response.status === 401) {
      console.log("Token expiré. Récupération en cours...");
      await getAccessToken();
      return checkStreamerAndNotify();
    }

    const data = await response.json();
    const liveNow = data.data && data.data.length > 0;

    if (liveNow && !isLive) {
      isLive = true;

      chrome.notifications.create(twitchNotificationId, {
        type: "basic",
        iconUrl: "src/img/twitch-1.png",
        title: "Akaruu est en live !",
        message: data.data[0].title || "Viens voir sur Twitch !"
      });

      // Notifier le popup s'il est ouvert
      chrome.runtime.sendMessage({ action: "setOnlineStatus" });
    }

    if (!liveNow && isLive) {
      isLive = false; // Reset pour prochaine fois
    }

  } catch (err) {
    console.error("Erreur lors de la vérification Twitch :", err);
  }
}

// Vérifie toutes les 2 minutes sans spam
chrome.alarms.create("checkLive", { periodInMinutes: 2 });
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "checkLive") {
    checkStreamerAndNotify();
  }
});

checkStreamerAndNotify();

chrome.notifications.onClicked.addListener((notificationId) => {
  if (notificationId === twitchNotificationId) {
    chrome.tabs.create({ url: "https://www.twitch.tv/akaruu" });
  }
});