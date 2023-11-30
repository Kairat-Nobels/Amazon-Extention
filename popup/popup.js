function openAmazon()
{
    chrome.tabs.create({ url: 'https://www.amazon.com' });
}

document.addEventListener('DOMContentLoaded', function ()
{
    const amazonButton = document.querySelector('#amazonButton').addEventListener('click', openAmazon);
});

//open page
const openOptionsButton = document.querySelector('#openPage');

openOptionsButton.addEventListener('click', openProducts);
function openProducts()
{
    chrome.tabs.create({ url: chrome.runtime.getURL('../page/product.html') });
}

//open about page
const about = document.querySelector('#aboutPage');
about.addEventListener('click', openOptions);
function openOptions()
{
    chrome.tabs.create({ url: chrome.runtime.getURL('../page/about.html') });
}

