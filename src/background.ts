let ws: WebSocket | null = null;
const notificationId = 'akaruu_notification';
let isLive = false;

function connectWebSocket() {
  if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) {
    console.log('🔄 WebSocket déjà actif');
    return;
  }

  console.log('🌐 Connexion WebSocket...');
  ws = new WebSocket('ws://localhost:8080');

  ws.onopen = () => {
    console.log('✅ WebSocket connecté');
    ws?.send('Extension connectée !');
  };

  ws.onmessage = (event) => {
    console.log('📩 Message reçu du serveur:', event.data);

    isLive = true;

    chrome.action.setIcon({
      path: chrome.runtime.getURL('imgs/icon_on.png')
    }, () => {
      if (chrome.runtime.lastError) {
        console.error('⚠️ Erreur en changeant l’icône:', chrome.runtime.lastError.message);
      } else {
        console.log('🎨 Icône changée en ON (LIVE)');
      }
    });

    chrome.runtime.sendMessage({ type: 'akaruu_live', data: event.data })
      .catch((err) => {
        console.warn('📭 Aucun listener pour akaruu_live:', err.message);
      });

    chrome.notifications.create(notificationId, {
      type: 'basic',
      iconUrl: chrome.runtime.getURL('imgs/twitch.png'),
      title: 'Akaruu est actuellement en ligne !',
      message: event.data,
    });
  };

  ws.onclose = () => {
    console.log('❌ WebSocket fermé, reconnexion dans 2.5s...');

    isLive = false;

    chrome.action.setIcon({
      path: chrome.runtime.getURL('imgs/icon_off.png')
    }, () => {
      if (chrome.runtime.lastError) {
        console.error('⚠️ Erreur en remettant l’icône OFF:', chrome.runtime.lastError.message);
      } else {
        console.log('🎨 Icône changée en OFF');
      }
    });

    chrome.runtime.sendMessage({ type: 'akaruu_offline' })
      .catch((err) => {
        console.warn('📭 Aucun listener pour akaruu_offline:', err.message);
      });

    ws = null;
    setTimeout(connectWebSocket, 2500);
  };

  ws.onerror = (err) => {
    console.error('⚠️ Erreur WebSocket:', err);
    ws?.close();
  };
}

chrome.notifications.onClicked.addListener((clickedId) => {
  if (clickedId === notificationId) {
    chrome.tabs.create({ url: 'https://www.twitch.tv/akaruu' });
  }
});

function keepAlive() {
  chrome.runtime.getPlatformInfo(() => {
    console.log('❤️ Keep-alive ping');
  });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'get_live_status') {
    console.log('📨 get_live_status demandé, retour:', isLive);
    sendResponse({ isLive });
  }
});

chrome.runtime.onInstalled.addListener(() => {
  console.log('🛠️ Extension installée');
  connectWebSocket();
  chrome.alarms.create('keepAlive', { periodInMinutes: 0.5 });
  keepAlive();
});

chrome.runtime.onStartup.addListener(() => {
  console.log('🚀 Chrome redémarré');
  connectWebSocket();
  keepAlive();
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'keepAlive') {
    console.log('🔔 Keep-alive déclenché');
    keepAlive();
    connectWebSocket();
  }
});