// create ul for render
const ul = document.querySelector('.productList');

// get data from chrome.storage
chrome.storage.sync.get(['products'], function (result)
{
    const products = result.products || [];
    // render products
    products.reverse().forEach(product =>
    {
        const li = document.createElement('li');
        const productName = document.createElement('a');
        productName.href = product.url;
        productName.target = '_blank';
        productName.innerHTML = `<h3>${product.name}</h3>`

        li.appendChild(productName);
        ul.appendChild(li);

        const table = document.createElement('table');
        table.style.border = '1px solid black';

        const currentMonth = new Date().toLocaleString('default', { month: 'long' });
        const previousMonth1 = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1).toLocaleString('default', { month: 'long' });
        const previousMonth2 = new Date(new Date().getFullYear(), new Date().getMonth() - 2, 1).toLocaleString('default', { month: 'long' });

        const tableContent = `
      <tr>
          <th>Product code:</th>
          <td>${product.code}</td>
      </tr>
      <tr>
          <th>${currentMonth}</th>
          <th>${previousMonth1}</th>
          <th>${previousMonth2}</th>
      </tr>
      <tr>
          <td>${product.actualPrice}</td>
          <td>${product.agoMonth}</td>
          <td>${product.ago2Month}</td>
      </tr>
    `;
        table.innerHTML = tableContent;
        li.appendChild(table);
    });
});
