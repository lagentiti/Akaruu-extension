"use strict";
function updateLiveStatus(isLive) {
    const liveStatusImg = document.querySelector('.live-status');
    if (liveStatusImg) {
        if (isLive) {
            liveStatusImg.src = './imgs/online.gif';
            console.log('🟢 Akaruu est en live');
        }
        else {
            liveStatusImg.src = './imgs/offline.png';
            console.log('🔴 Akaruu est hors ligne');
        }
    }
}
chrome.runtime.sendMessage({ type: 'get_live_status' }, (response) => {
    if (chrome.runtime.lastError) {
        console.error('⚠️ Erreur en demandant l’état live:', chrome.runtime.lastError.message);
    }
    else {
        console.log('ℹ️ État actuel reçu:', response);
        updateLiveStatus(response.isLive);
    }
});
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'akaruu_live') {
        console.log('📢 Message reçu: akaruu_live');
        updateLiveStatus(true);
    }
    else if (message.type === 'akaruu_offline') {
        console.log('📢 Message reçu: akaruu_offline');
        updateLiveStatus(false);
    }
});
