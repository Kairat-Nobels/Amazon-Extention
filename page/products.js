// create ul for render
const ul = document.querySelector('.productList');

// get data from chrome.storage
chrome.storage.sync.get(['products'], function (result)
{
    const products = result.products || [];
    const h1 = document.querySelector('h1');
    if (products.length > 0) {
        const empty = document.querySelector('.empty')
        empty.style.display = 'none';
        h1.textContent = `Last ${products.length} Visited products`
        // render products
        products.reverse().forEach(product =>
        {
            const li = document.createElement('li');
            const productName = document.createElement('h2');
            productName.textContent = `${product.name}`;

            li.appendChild(productName);

            const table = document.createElement('div');
            table.classList.add('card');

            const monthNames = [
                'January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'
            ];
            const currentMonth = monthNames[new Date().getMonth()];
            const previousMonth1 = monthNames[new Date().getMonth() - 1];
            const previousMonth2 = monthNames[new Date().getMonth() - 2];

            // create delete functional
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete product';
            deleteButton.addEventListener('click', () =>
            {
                const updatedProducts = products.filter(p => p.code !== product.code);
                chrome.storage.sync.set({ 'products': updatedProducts }, () =>
                {
                    li.remove();
                });
            });

            const tableContent = `
            <h3>Product code: ${product.code}</h3>
            <div class="cardItem">
                <div>
                    <p class="month">${currentMonth}</p>
                    <p>${product.actualPrice}</p>
                </div>
                <div>
                    <p class="month">${previousMonth1}</p>
                    <p>${product.agoMonth}</p>
                </div>
                <div>
                    <p class="month">${previousMonth2}</p>
                    <p>${product.ago2Month}</p>
                </div>
            </div>
            <div class="actions">
                <a href="${product.url}" class="btnForGo" target="_blank">Look in the store</a>
            </div>
        `;
            table.innerHTML = tableContent;

            const actionsDiv = table.querySelector('.actions');
            actionsDiv.appendChild(deleteButton);
            li.appendChild(table);
            ul.appendChild(li);
        });
    }
    else {
        h1.textContent = 'Your list of recently viewed products on Amazon is empty.'
    }
});

