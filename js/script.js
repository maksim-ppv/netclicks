

const leftMenu = document.querySelector('.left-menu'),
    hamburger = document.querySelector('.hamburger'),
    showList = document.querySelector('.tv-shows__list');


// открытие/закрытие меню

hamburger.addEventListener('click', () => {
    leftMenu.classList.toggle('openMenu');
    hamburger.classList.toggle('open');
});

document.addEventListener('click', (event)=>{

    if(!event.target.closest('.left-menu')){
        leftMenu.classList.remove('openMenu');
        hamburger.classList.remove('open');
    }
});

leftMenu.addEventListener('click', event => {
    const target = event.target;
    const dropdown = target.closest('.dropdown');
    if (dropdown){
        dropdown.classList.toggle('active');
        leftMenu.classList.add('openMenu');
        hamburger.classList.add('open');
    }
});

const preView = (event) => {
    const target = event.target;
    const tvCard = target.closest('.tv-card');
    if(tvCard){
        const img = tvCard.querySelector('.tv-card__img');
        const dataSet = img.dataset.backdrop;
        const imgsrc = img.src;
        img.src = dataSet;
        img.dataset.backdrop = imgsrc;
    }

};

showList.addEventListener('mouseover', preView);

showList.addEventListener('mouseout', preView);