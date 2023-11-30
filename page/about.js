// get card
const div = document.querySelector('#aboutCard')

// render info about extension
chrome.management.getSelf(function (info)
{
    console.log(info);
    div.querySelector('h3').innerText = info.shortName;
    div.querySelector('p').innerText = info.description;
    div.querySelector('img').src = info.icons[3].url;
});

//adaptive page by chanhing dispay width
chrome.system.display.getInfo(function (data)
{
    const widthOfD = data[0].bounds.width;

    function applyStyles(width)
    {
        if (width < 676) {
            div.classList.add('small-screen');
            div.classList.remove('large-screen');
        } else {
            div.classList.remove('small-screen');
            div.classList.add('large-screen');
        }
    }

    applyStyles(widthOfD);
    window.addEventListener('resize', function ()
    {
        const newWidth = data[0].bounds.width;
        applyStyles(newWidth);
    });
});
