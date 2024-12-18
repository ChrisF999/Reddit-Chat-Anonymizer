// Function to start the continuous inspection after initial delay
function startTimelineEventInspection() {
    setInterval(inspectTimelineEvents, 50);
}

function inspectTimelineEvents() {
    const rsApp = document.querySelector('rs-app');
    const curUser = rsApp?.querySelector('rs-current-user');
    if (!rsApp?.shadowRoot) return console.log('Shadow root not found');

    const overlayManager = rsApp.shadowRoot.querySelector('rs-room-overlay-manager');
    if (!overlayManager) return console.log('Overlay manager not found');

    const rsRoom = overlayManager.querySelector('rs-room');
    if (!rsRoom?.shadowRoot) return console.log('rs-room shadow root not found');

    const timeline = rsRoom.shadowRoot.querySelector('rs-timeline');
    if (!timeline?.shadowRoot) return console.log('Timeline shadow root not found');

    const virtualScroll = timeline.shadowRoot.querySelector('rs-virtual-scroll-dynamic');
    if (!virtualScroll?.shadowRoot) return console.log('Virtual scroll shadow root not found');

    const timelineEvents = virtualScroll.shadowRoot.querySelectorAll('rs-timeline-event');
    if (timelineEvents.length === 0) return console.log('No timeline events found');

    timelineEvents.forEach((event) => {
        const flex_col = event.shadowRoot.querySelector('rs-timeline-event-hovercard-display-name');
        const nameSpan = flex_col?.querySelector('span');
        if (nameSpan?.textContent !== curUser?.getAttribute('display-name')) {
            nameSpan.textContent = '';
            const user_avatar = event.shadowRoot.querySelector('image') || event.shadowRoot.querySelector('img');
            user_avatar.src = 'https://www.startpage.com/av/proxy-image?piurl=https%3A%2F%2Fcornellsun.com%2Fwp-content%2Fuploads%2F2020%2F06%2F1591119073-screen_shot_2020-06-02_at_10.30.13_am.png&sp=1734558454T510aedac7ed452a76696565b2313da677501f545ea3ba06b99b32985abcac633';
            user_avatar.setAttribute('href', user_avatar.src);
            user_avatar.onload = () => user_avatar.dispatchEvent(new CustomEvent('render', {
                bubbles: true
            }));
        }
    });
}

// Initial 2-second wait before starting continuous inspection
console.log('Waiting 2 seconds before starting inspection...');
setTimeout(startTimelineEventInspection, 2000);