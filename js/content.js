// function for generating price
function generateFakePrice(currentPrice)
{
    const percentageChange = (Math.random() * 61) - 30;
    const changeAmount = (currentPrice * percentageChange) / 100;
    const newPrice = currentPrice + changeAmount;

    return newPrice;
}
// change our information on page
function displayPriceOrLocationInfo()
{
    const isProductPage = checkIfProductPage();

    if (isProductPage) {
        const productCode = getProductCode();
        displayPriceInCorner(productCode);
    } else {
        displayLocationInfo();
    }
}
const locationInfo = document.createElement('div');

// checking with page opening now
function checkIfProductPage()
{
    return window.location.hostname.includes('amazon') && window.location.pathname.includes('/dp/');
}

// fucntion for get product code
function getProductCode()
{
    const url = window.location.href;
    const regex = /\/dp\/(\w{10})/;
    const match = url.match(regex);

    if (match && match.length >= 2) {
        return match[1];
    }

    const productCodeElement = document.querySelector('[data-asin]');
    if (productCodeElement) {
        return productCodeElement.getAttribute('data-asin');
    }

    return null;
}

// function for get save information about product and render prices
function displayPriceInCorner(productCode)
{
    const priceElement = document.querySelector('.a-price-whole');
    const cents = document.querySelector('.a-price-fraction');

    if (priceElement && productCode) {
        const currentPriceText = `${priceElement.textContent}${cents.textContent}`;
        const currentPrice = parseFloat(currentPriceText.replace(/[^0-9.-]+/g, ''));

        const productUrl = window.location.href;
        const nameProduct = document.body.querySelector('#title_feature_div').querySelector('h1').textContent;
        chrome.storage.sync.get(['products'], function (result)
        {
            const existingData = result.products || [];
            const existingProduct = existingData.find(data => data.code === productCode);

            let previousPrices = [];

            if (existingProduct) {
                previousPrices = [
                    parseFloat(existingProduct.ago2Month.replace(/[^0-9.-]+/g, '')),
                    parseFloat(existingProduct.agoMonth.replace(/[^0-9.-]+/g, ''))
                ];
            } else {
                previousPrices = [
                    generateFakePrice(currentPrice),
                    generateFakePrice(currentPrice)
                ];
            }

            const procent = Math.round(((currentPrice - previousPrices[1]) / previousPrices[1]) * 100)
            const div = document.createElement('div');
            div.id = 'procentProduct'
            div.innerHTML = procent > 0 ? `
            <h4>${Math.abs(procent)}% more expensive than last month</h4>
            ` :
                `
                <h4>${Math.abs(procent)}% cheaper than last month</h4>
            `
            const tableContent = document.createElement('div')
            const title = document.createElement('h3')
            title.textContent = 'Prices for previous months'
            tableContent.appendChild(title)
            const priceInfoTable = document.createElement('table');
            priceInfoTable.style.border = '1px solid black';
            priceInfoTable.innerHTML = `
          <tr>
              <th>This month</th>
              <th>Last month</th>
              <th>2 month ago</th>
          </tr>
          <tr>
              <td>${currentPrice.toFixed(2)} $</td>
              <td>${previousPrices[1].toFixed(2)} $</td>
              <td>${previousPrices[0].toFixed(2)} $</td>
          </tr>
      `;
            tableContent.appendChild(priceInfoTable)

            const locationInfo = document.createElement('div');
            locationInfo.id = 'amazonLocationInfo';
            document.body.appendChild(locationInfo);
            locationInfo.appendChild(div);

            let opened = false;

            locationInfo.onclick = (e) =>
            {
                e.stopPropagation()
                opened = true;
                locationInfo.innerHTML = ''
                locationInfo.appendChild(tableContent)
            }
            document.body.onclick = (e) =>
            {
                if (opened) {
                    opened = false;
                    locationInfo.innerHTML = ''
                    locationInfo.appendChild(div);
                }
            }

            // styles
            locationInfo.style.cssText = `
                position: fixed;
                bottom: 10px;
                left: 10px;
                background-color: white;
                padding: 5px;
                border: 1px solid black;
                z-index: 9999;
            `;
            div.style.cssText = `
                cursor: pointer;
                background-color: orange;
            `;


            // save data to chrome storage
            if (!existingProduct) {
                const newData = {
                    code: productCode,
                    name: nameProduct.trim(),
                    url: productUrl,
                    actualPrice: `${currentPrice.toFixed(2)} $`,
                    agoMonth: `${previousPrices[0].toFixed(2)} $`,
                    ago2Month: `${previousPrices[1].toFixed(2)} $`
                };
                if (existingData.length > 14) {
                    existingData.shift();
                }
                existingData.push(newData);

                chrome.storage.sync.set({ products: existingData }, function ()
                {
                    console.log('The data was successfully saved to chrome.storage.');
                });
            } else {
                console.log('The product code already exists in the storage.');
            }

            chrome.storage.sync.get(['products'], function (result)
            {
                console.log(result);
            });
        });
    }
}

// render default content on corner in amazon page
function displayLocationInfo()
{
    locationInfo.id = 'amazonLocationInfo';
    locationInfo.textContent = 'Вы находитесь на Amazon';
    locationInfo.style.position = 'fixed';
    locationInfo.style.bottom = '10px';
    locationInfo.style.left = '10px';
    locationInfo.style.backgroundColor = 'white';
    locationInfo.style.padding = '5px';
    locationInfo.style.border = '1px solid black';
    locationInfo.style.zIndex = '9999';

    document.body.appendChild(locationInfo);
}

window.onload = displayPriceOrLocationInfo;
