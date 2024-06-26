const menuBtn = document.querySelector('.menu-btn');
const menu = document.querySelector('.menu');
const menuNav = document.querySelector('.menu-nav');


const downBtns = document.querySelectorAll('.down-button');
const upBtns = document.querySelectorAll('.up-button');
const images = document.querySelectorAll('.image-container');
let currentImage = 2;

const leftBtn = document.querySelector('.left-button');
const rightBtn = document.querySelector('.right-button');

const navItems = document.querySelectorAll('.nav-item');
const navLinks = document.querySelectorAll('.nav-link');
const pages = document.querySelectorAll('.page');

let timer = new Date();
let currentPage = 0;

let showMenu = false;

let throttleTimeout = null;
const THROTTLE_DELAY = 500;
let isScrolling = false;

menuBtn.addEventListener('click', toggleMenu);
downBtns.forEach(btn => btn.addEventListener('click', scrollDown))
upBtns.forEach(btn => btn.addEventListener('click', scrollUp))

leftBtn.addEventListener('click', scrollLeft);
rightBtn.addEventListener('click', scrollRight);


function toggleMenu()
{
    if (!showMenu)
    {
        menuBtn.classList.add('close');
        menu.classList.add('show');
        menuNav.classList.add('show');

        navItems.forEach(item => item.classList.add('show'));

        showMenu = true;
    }
    else{
        menuBtn.classList.remove('close');
        menu.classList.remove('show');
        menuNav.classList.remove('show');

        navItems.forEach(item => item.classList.remove('show'));

        showMenu = false;
    }
}

function scrollDown()
{
    const targetPage = pages[currentPage+1];
    if (targetPage)
        {
            targetPage.scrollIntoView({behavior: 'smooth', block: 'start'});
        }

        setCurrentPage(currentPage+1);

}

function scrollUp()
{
    const targetPage = pages[currentPage-1];
    if (targetPage)
    {
        targetPage.scrollIntoView({behavior: 'smooth', block: 'end'});
    }

    setCurrentPage(currentPage-1);
}


function scrollToPage(pg)
{
    if (pg < 0)
    {
        pg = 0
    }
    else if (pg > pages.length)
    {
        pg = pages.length -1
    }
    const targetPage = pages[pg];
    if (targetPage)
    {
        targetPage.scrollIntoView({behavior: 'smooth', block: 'end'});
        currentPage = pg;
    }
}

function setGallery(direction)
{
    let newImage = currentImage + direction;
    if (newImage < 0)
    {
        newImage = images.length-1;
    }
    else if (newImage >= images.length)
    {
        newImage = 0;
    }

    for (i = 0; i < images.length; i++)
    {
        const relation = newImage - i;
        const transformValue = 100*relation + "vw";
        images[i].style.transform = "translate3d(" + transformValue + ", 0, 0)";
        
    }

    console.log("Current image: " + currentImage + " newImage = " + newImage + " images.length: " + images.length)
    currentImage = newImage;
}

document.addEventListener('DOMContentLoaded', setPaddingForImages);

// Set Padding for the smaller images to center them on load
function setPaddingForImages() {
    
    let maxWidth = 0;
    images.forEach(image => {
        if (image.width > maxWidth) {
            maxWidth = image.width;
        }
    });

    images.forEach(image => {
        const widthDiff = maxWidth - image.width;
        const paddingValue = widthDiff / 2; 

        image.style.paddingLeft = paddingValue + "px";
        image.style.paddingRight = paddingValue + "px";
    });
    setPageOnLoad();
    setGallery(-1);
}

// Set the current page value based on scroll in case the user reloads the page
function setPageOnLoad() 
{
    const scrollY = window.scrollY; 
    const pageHeight = window.innerHeight;
  
    setCurrentPage(Math.floor(scrollY / pageHeight));
}

function scrollLeft()
{
    setGallery(-1);
}

function scrollRight()
{
    setGallery(1);
}

// Set small image-containers padding on load to help center them
window.addEventListener('load', () => {
    const containers = document.querySelectorAll('.small');
    containers.forEach(container => {
        const containerHeight = container.clientHeight *0.01; //Convert to VH
        container.style.padding = `${20-(containerHeight*0.5)}vh`, 0, 0, 0 ;
    });
});

document.addEventListener('wheel', function(event) {
    event.preventDefault();
    if (!isScrolling) // Wait for the transition to finish in order to not cause weird bugginess
    { 
        console.log("In the if");
        isScrolling = true;
        determineScroll(event);
        setTimeout(function() {
            isScrolling = false;
        }, THROTTLE_DELAY); 
    }
}, { passive: false });

function determineScroll(event)
{
    console.log(currentPage);

        scrollToPage(currentPage + Math.sign(event.deltaY));
      
    /*
    if (event.deltaY < 0)
    {
        scrollUp();
    }
    else if (event.deltaY > 0)
    {
        scrollDown();
    }
    
 */
       
}


function setCurrentPage(index)
{
    
    if (index < 0)
    {
        index = 0;
    }
    else if (index >= pages.length)
    {
        index = pages.length-1;
    }

    currentPage = index;

    for (i = 0; i < navItems.length; i++)
    {
        if (i == currentPage)
        {
            navItems[i].classList.add("current");
        }
        else 
        {
            navItems[i].classList.remove("current");
        }
    }
}

// Determine which navLink was clicked and set current page value accordingly
navLinks.forEach((link, index) => {
    link.addEventListener('click', (event) => {
        event.preventDefault();
        setCurrentPage(index);
        const targetPage = pages[index];
        targetPage.scrollIntoView({behavior: 'smooth', block: 'end'});
    });
});