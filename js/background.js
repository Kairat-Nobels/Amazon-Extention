// on first generation
chrome.storage.sync.get('products', function (data)
{
    if (Object.keys(data).length === 0 && data.constructor === Object) {
        chrome.storage.sync.set({ 'products': [] }, function ()
        {
            console.log('array created successfully');
        });
    } else {
        var products = data.products;
        console.log('your products":', products);
    }
});

// for collection open amazon tabs
let amazonTabs = [];

// increase visited product count
function incrementVisitedProducts()
{
    chrome.cookies.get({ url: 'https://amazon.com', name: 'visitedProducts' }, function (cookie)
    {
        const visitedProducts = cookie ? parseInt(cookie.value) : 0;
        chrome.cookies.set({
            url: 'https://amazon.com',
            name: 'visitedProducts',
            value: (visitedProducts + 1).toString(),
            expirationDate: Math.floor(Date.now() / 1000) + 3600 * 2,
        });
    });
}

// check on the product page and increase the visit counter
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab)
{
    if (changeInfo.status === 'complete' && tab.url.includes('amazon') && tab.url.includes('/dp/')) {
        chrome.storage.sync.get(['products'], function (result)
        {
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs)
            {
                if (tabs && tabs.length > 0) {
                    const currentTab = tabs[0];
                    const currentURL = currentTab.url;
                    const find = result.products.find(data => data.url === currentURL)
                    if (!find) incrementVisitedProducts();
                }
            });
        });
    }
});

// function for sending notifications
function sendNotificationWithButtons(visitedCount)
{
    chrome.notifications.create('notificationWithButtons', {
        type: 'basic',
        iconUrl: '../icons/logo.png',
        title: 'AkchaTab Tracker',
        message: `Today you've viewed ${visitedCount} products on Amazon.`,
        buttons: [
            { title: 'Close' },
            { title: 'Go Products' }
        ],
        silent: false
    });
}

// event handler for clicking buttons in a notification
chrome.notifications.onButtonClicked.addListener(function (notificationId, buttonIndex)
{
    if (notificationId === 'notificationWithButtons') {
        if (buttonIndex === 0) {
            chrome.notifications.clear('notificationWithButtons');
        } else if (buttonIndex === 1) {
            chrome.tabs.create({ url: chrome.runtime.getURL('page/product.html') });
        }
    }
});

// fetches the active tabs on Amazon and stores their IDs in the amazonTabs array
chrome.tabs.query({ url: 'https://www.amazon.c/*' }, function (tabs)
{
    amazonTabs = tabs.map(tab => tab.id);
});

// count open amazon tabs
chrome.tabs.onCreated.addListener(function (tab)
{
    if (tab?.pendingUrl?.includes('amazon') || tab?.url?.includes('amazon')) {
        amazonTabs.push(tab.id);
    }
});

// Send a notification after 1sec when all amazon tabs have closed
chrome.tabs.onRemoved.addListener(function (tabId)
{
    const index = amazonTabs.indexOf(tabId);
    console.log(amazonTabs, tabId);
    if (index !== -1) {
        amazonTabs.splice(index, 1);
        if (amazonTabs.length === 0) {
            chrome.alarms.create('sendNotificationDelay', { delayInMinutes: 1 / 60 });

            chrome.cookies.get({ url: 'https://amazon.com', name: 'visitedProducts' }, function (cookie)
            {
                const visitedProducts = cookie ? parseInt(cookie.value) : 0;
                chrome.alarms.onAlarm.addListener(function (alarm)
                {
                    if (alarm.name === 'sendNotificationDelay') {
                        sendNotificationWithButtons(visitedProducts);
                    }
                });
            });
        }
    }
});
