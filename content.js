
// content.js (same as before, but using browser.storage instead of localStorage)
let intervalId = null;

// Use browser.storage instead of localStorage
browser.storage.local.get('redditChatAnonymizerEnabled').then(result => {
    isEnabled = result.redditChatAnonymizerEnabled !== false;
});

function createToggleButton() {
    const button = document.createElement('button');
    button.textContent = `Anonymizer: ${isEnabled ? 'ON' : 'OFF'}`;
    button.style.cssText = `
        position: fixed;
        top: 10px;
        right: 100px;
        z-index: 10000;
        padding: 8px 16px;
        background-color: #1a1a1b;
        color: #d7dadc;
        border: 1px solid #343536;
        border-radius: 4px;
        cursor: pointer;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        font-size: 14px;
    `;
    button.addEventListener('click', toggleAnonymizer);
    document.body.appendChild(button);
}

function toggleAnonymizer() {
    isEnabled = !isEnabled;
    browser.storage.local.set({ redditChatAnonymizerEnabled: isEnabled });
    const button = document.querySelector('button');
    button.textContent = `Anonymizer: ${isEnabled ? 'ON' : 'OFF'}`;
    if (isEnabled) {
        startTimelineEventInspection();
    } else if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
        window.location.reload();
    }
}

function startTimelineEventInspection() {
    if (intervalId) clearInterval(intervalId);
    intervalId = setInterval(inspectTimelineEvents, 50);
}

function inspectTimelineEvents() {
    if (!isEnabled) return;
    const rsApp = document.querySelector('rs-app');
    const curUser = rsApp?.querySelector('rs-current-user');
    const overlayManager = rsApp?.shadowRoot?.querySelector('rs-room-overlay-manager');
    const rsRoom = overlayManager?.querySelector('rs-room');
    const timeline = rsRoom?.shadowRoot?.querySelector('rs-timeline');
    const virtualScroll = timeline?.shadowRoot?.querySelector('rs-virtual-scroll-dynamic');
    const timelineEvents = virtualScroll?.shadowRoot?.querySelectorAll('rs-timeline-event');
    
    if (timelineEvents) {
        timelineEvents.forEach(event => {
            const flex_col = event.shadowRoot.querySelector('rs-timeline-event-hovercard-display-name');
            const nameSpan = flex_col?.querySelector('span');
            if (nameSpan?.textContent !== curUser?.getAttribute('display-name')) {
                nameSpan.textContent = '';
                const user_avatar = event.shadowRoot.querySelector('image') || event.shadowRoot.querySelector('img');
                user_avatar.src = 'https://www.startpage.com/av/proxy-image?piurl=https%3A%2F%2Fcornellsun.com%2Fwp-content%2Fuploads%2F2020%2F06%2F1591119073-screen_shot_2020-06-02_at_10.30.13_am.png&sp=1734558454T510aedac7ed452a76696565b2313da677501f545ea3ba06b99b32985abcac633';
                user_avatar.setAttribute('href', user_avatar.src);
                user_avatar.onload = () => user_avatar.dispatchEvent(new CustomEvent('render', { bubbles: true }));
            }
        });
    }
}

// Initialize
setTimeout(() => {
    createToggleButton();
    if (isEnabled) startTimelineEventInspection();
}, 2000);
