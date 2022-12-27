chrome.action.onClicked.addListener(async (tab2) => {

     const prevState = await chrome.action.getBadgeText({ tabId: tab2.id });
     const nextState = prevState === 'ON' ? 'OFF' : 'ON';

     const messageToContenxt = nextState === 'ON' ? "run" : "clear";

     const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
     chrome.tabs.sendMessage(tab.id, { requestOwm: messageToContenxt });

     await chrome.action.setBadgeText({
          tabId: tab2.id,
          text: nextState,
     });

     if (nextState === "OFF") {
          chrome.action.setBadgeBackgroundColor({
               color: "#606060"
          });
     } else {
          chrome.action.setBadgeBackgroundColor({
               color: "#228B22"
          });
     }

});

chrome.runtime.onInstalled.addListener(async function () {
     await chrome.action.setBadgeBackgroundColor({
          color: "#606060"
     });

     await chrome.action.setBadgeText({
          text: 'OFF'
     });
});

