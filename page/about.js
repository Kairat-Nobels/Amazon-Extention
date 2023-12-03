// get card
const div = document.querySelector('#aboutCard')
const desc = document.querySelector('#description')
const footerUl = document.querySelector('footer').querySelector('ul')
const vers = document.querySelector('#version')
// render info about extension
chrome.management.getSelf(function (info)
{
    console.log(info);
    div.querySelector('h3').innerText = info.shortName;
    desc.innerText = info.description;
    vers.innerText = info.version;
    div.querySelector('img').src = info.icons[3].url;
    for (let i = 0; i < info.permissions.length; i++) {
        const li = document.createElement('li');
        li.innerText = info.permissions[i]
        footerUl.appendChild(li);
    }
});

//adaptive page by chanhing dispay width
function getWidth()
{
    return new Promise((resolve, reject) =>
    {
        chrome.system.display.getInfo(function (data)
        {
            const widthOfD = data[0]?.bounds?.width || null;
            if (widthOfD !== null) {
                resolve(widthOfD);
            } else {
                reject("Failed to retrieve width");
            }
        });
    });
}

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

// get width
getWidth()
    .then((width) =>
    {
        applyStyles(width);
    })
    .catch((error) =>
    {
        console.error("Error:", error);
    });

// window on resize
window.addEventListener('resize', function ()
{
    getWidth()
        .then((newWidth) =>
        {
            console.log(newWidth);
            applyStyles(newWidth);
        })
        .catch((error) =>
        {
            console.error("Error:", error);
        });
});

// slider
const nextBtn = document.querySelector('.next')
const prevBtn = document.querySelector('.prev')
const dots = document.querySelectorAll('.dot');
let slideIndex = 1;
showSlides(slideIndex);

// Next/previous controls
function plusSlides(n)
{
    showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n)
{
    showSlides(slideIndex = n);
}

function showSlides(n)
{
    let i;
    let slides = document.getElementsByClassName("mySlides");
    if (n > slides.length) { slideIndex = 1 }
    if (n < 1) { slideIndex = slides.length }
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[slideIndex - 1].style.display = "block";
    dots[slideIndex - 1].classList.add("active");
}

prevBtn.onclick = (e) =>
{
    e.preventDefault();
    plusSlides(-1)
}
nextBtn.onclick = (e) =>
{
    e.preventDefault();
    plusSlides(1)
}

for (let i = 0; i < dots.length; i++) {
    dots[i].onclick = () => currentSlide(i + 1)
}