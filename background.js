const app_name = browser.runtime.getManifest().short_name;
const stremio_url = '*://web.stremio.com/*';

browser.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (changeInfo.status === 'loading') {
        let tabs = await browser.tabs.query({url: stremio_url});

        if (typeof port === 'undefined' && tabs.length > 0) {
            port = browser.runtime.connectNative(app_name);
            if (port.error === null) {
			    console.log('[onUpdated] Port established:', port);
            } else {
                console.log('[onUpdated] Failed to establish port:', port);
            }
        } else if (typeof port === 'object' && tabs.length === 0) {
            console.log('[onUpdated] No matching tabs left, disconnecting port.');
            port.disconnect();
            port = undefined;
        }
    }
});

browser.tabs.onRemoved.addListener(async (tabId, removeInfo) => {
    if (typeof port === 'object') {
        let tabs = await browser.tabs.query({url: stremio_url});

        if (tabs.length === 0 || (tabs.length === 1 && tabs[0].id === tabId)) {
            console.log('[onRemoved] No matching tabs left, disconnecting port.');
            port.disconnect();
            port = undefined;
        }
    }
});

browser.action.onClicked.addListener(() => {
    browser.tabs.create({url: 'https://web.stremio.com'})
});