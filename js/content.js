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
        let nameProduct = document.body.querySelector('#title_feature_div').querySelector('h1') || document.body.querySelector('#title_feature_div').querySelector('#title');
        nameProduct = nameProduct.textContent
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
            <h4 style="color: #000; font-family: Niramit, Arial, sans-serif;"><span style="
                    color: #000;
                    font-size: 20px;
                    font-weight: 600;
                ">${Math.abs(procent)}%</span> more expensive than last month</h4>
            ` :
                `
                <h4 style="color: #000; font-family: Niramit, Arial, sans-serif;"><span style="
                    color: #000;
                    font-size: 20px;
                    font-weight: 600;
                ">${Math.abs(procent)}%</span> cheaper than last month</h4>
            `
            const monthNames = [
                'January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'
            ];
            const currentMonth = monthNames[new Date().getMonth()];
            const previousMonth1 = monthNames[new Date().getMonth() - 1];
            const previousMonth2 = monthNames[new Date().getMonth() - 2];

            const tableContent = document.createElement('div')
            tableContent.style = `
            position: relative;
            padding: 5px 10px;
            `
            const title = document.createElement('h3')
            title.style = `
                border-radius: 7px;
                margin: 5px 10px 12px 0px;
                padding: 5px 14px;
                border: 1px solid #000;
                background: #00FFB2;
                box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
                color: #000;
                font-family: Montserrat, Arial, sans-serif;
                font-size: 20px;
                font-weight: 500;`;
            title.textContent = 'Prices for previous months'
            tableContent.appendChild(title)
            const priceInfoTable = document.createElement('table');
            priceInfoTable.style = `margin: 0; font-size: 20px; table-layout: auto; width: 100%;`
            priceInfoTable.innerHTML = `
          <tr style="color: #040404; font-family: Montserrat, Arial, sans-serif;font-size: 16px;font-weight: 600; margin-bottom: -5px">
              <td>${currentMonth}</td>
              <td>${previousMonth1}</td>
              <td>${previousMonth2}</td>
          </tr>
          <tr style="color: #9643FF; font-family: Montserrat, Arial, sans-serif;font-size: 20px;font-weight: 700;">
              <td>${currentPrice.toFixed(2)}$</td>
              <td>${previousPrices[1].toFixed(2)}$</td>
              <td>${previousPrices[0].toFixed(2)}$</td>
          </tr>
      `;

            const locationInfo = document.createElement('div');
            locationInfo.id = 'amazonLocationInfo';
            document.body.appendChild(locationInfo);
            locationInfo.innerHTML = ''
            locationInfo.appendChild(div);

            let opened = false;
            const xbtn = document.createElement('button');
            xbtn.textContent = 'x'
            xbtn.style = `position: absolute;
                top: -22px;
                right: -10px;
                font-size: 30px;
                paddingd: 4px;
                font-weight: 600;
                border: none;
                font-family: cursive;
                outline: none;
                background: transparent;`
            tableContent.appendChild(priceInfoTable);
            tableContent.appendChild(xbtn);
            div.onclick = (e) =>
            {
                e.stopPropagation()
                opened = true;
                locationInfo.innerHTML = ''
                locationInfo.appendChild(tableContent)
                locationInfo.style.padding = '10px'
            }
            tableContent.onclick = (e) =>
            {
                e.stopPropagation()
            }
            document.body.onclick = (e) =>
            {
                if (opened) {
                    opened = false;
                    locationInfo.innerHTML = ''
                    locationInfo.appendChild(div);
                    locationInfo.style.padding = '0px'
                }
            }
            xbtn.onclick = () =>
            {
                opened = false;
                locationInfo.innerHTML = ''
                locationInfo.appendChild(div);
                locationInfo.style.padding = '0px'
            }

            // styles
            locationInfo.style.cssText = `
                position: fixed;
                bottom: 40px;
                left: 10px;
                border-radius: 12px;
                border: 2px solid #000;
                background: #C0C0C0;
                z-index: 9999;
                overflow: hidden;
            `;
            div.style.cssText = `
                background: #00FFB2;
                cursor: pointer;
                box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
                padding: 10px 14px;
            `;

            // save data to chrome storage
            if (!existingProduct) {
                const newData = {
                    actualPrice: `${currentPrice.toFixed(2)} $`,
                    agoMonth: `${previousPrices[0].toFixed(2)} $`,
                    ago2Month: `${previousPrices[1].toFixed(2)} $`,
                    code: productCode,
                    name: nameProduct.trim(),
                    url: productUrl,
                };
                if (existingData.length > 11) {
                    existingData.shift();
                }
                existingData.push(newData);
                saveData(existingData)

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
    locationInfo.innerHTML = '<img width="120" src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhqZPXlanwZdY8tonG5i8SMUJvIM7taxDOSnG8K-Ymvwb_uWba1bopkxbTpKgpMxUBjNr6VJ1TRopQnM6EDJSz2QIHgcpA1DHoYzKK91tOA9j8ctTfsPxO4HFIKbx-XfJIEFCiWFyd8QqDYUkKOWqDSZsc71ygE_TZgeeHQ_kl0OZCVQjT2_F4WbW1aAyM/w320-h244/logo.png" alt="img" />'
    locationInfo.style.cssText = `
                position: fixed;
                bottom: 40px;
                left: 10px;
                background-color: #fff;
                width: 70px;
                border-radius: 10px;
                z-index: 9999;
                overflow: hidden;
            `;

    document.body.appendChild(locationInfo);
}

window.onload = displayPriceOrLocationInfo;

function saveData(data)
{
    chrome.storage.sync.set({ products: data }, function ()
    {
        console.log('The data was successfully saved to chrome.storage.');
    });
}