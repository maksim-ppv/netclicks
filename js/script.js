// меню 

const IMG_URL = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2';

const leftMenu = document.querySelector('.left-menu'),
    hamburger = document.querySelector('.hamburger'),
    tvShowList = document.querySelector('.tv-shows__list'),
    modal = document.querySelector('.modal'),
    tvShows = document.querySelector('.tv-shows'),
    tvCardImg = document.querySelector('.tv-card__img'),
    modalTitle = document.querySelector('.modal__title'),
    genresList = document.querySelector('.genres-list'),
    rating = document.querySelector('.rating'),
    description = document.querySelector('.description'),
    modalLink = document.querySelector('.modal__link'),
    preloader = document.querySelector('.preloader'),
    searchForm = document.querySelector('.search__form'),
    searchFormInput = document.querySelector('.search__form-input');

const loading = document.createElement('div');
loading.className = 'loading';

const DBService = class {

    constructor(){
        this.SERVER = 'https://api.themoviedb.org/3';
        this.API_KEY = 'f10a7c14e1d03c8d764d0e82df090e72';
    }

    getData = async (url) => {
        const res = await fetch(url);
        if(res.ok){
            return res.json();
        }else{
            throw new Error(`Не удалось получить данные по адресу ${url}`)
        }

    }

    getTestData = () => {
        return this.getData('test.json');
    }

    getTestCard = () => {
        return this.getData('card.json');
    }

    getSearchResult = query => {
        return this.getData(`${this.SERVER}/search/tv?api_key=${this.API_KEY}&query=${query}&language=ru-RU`);

    }

    getTvShow = id => {
        return this.getData(`${this.SERVER}/tv/${id}?api_key=${this.API_KEY}&language=ru-RU`);
    }
};

console.log(new DBService().getSearchResult('Мстители'));

const renderCard = response => {
    
    tvShowList.textContent ='';
    
    if(!response.total_results == 0){
        response.results.forEach(item => {
    
            const { 
                backdrop_path: backdrop, 
                name: title, 
                poster_path: poster, 
                vote_average: vote,
                id
                } = item;
    
            const posterIMG = poster ? IMG_URL + poster : './img/no-poster.jpg';
            const backdropIMG = backdrop ? IMG_URL + backdrop : '';
            const voteElem = vote ? `<span class="tv-card__vote">${vote}</span>` : '';
    
            const card = document.createElement('li');
            card.classList.add('tv-shows__item');
            card.innerHTML = `
                <a href="#" id="${id}" class="tv-card">
                    ${voteElem}
                <img class="tv-card__img"
                    src="${posterIMG}"
                    data-backdrop="${backdropIMG}"
                    
                    alt="${title}">
                <h4 class="tv-card__head">${title}</h4>
                </a>
            `;
            loading.remove();    
            tvShowList.append(card);
    
        });
    }else{
        loading.remove();
        const text = document.createElement('span');
        text.textContent = 'К сожалению, по Вашему запросу ничего не найдено'    
        tvShowList.append(text);
    }
};
searchFormInput.addEventListener('click', ()=>{
    searchFormInput.value = '';
});
searchForm.addEventListener('submit', event => {
    event.preventDefault();
    const value = searchFormInput.value.trim();
    if(value){
        tvShows.append(loading);
        new DBService().getSearchResult(value).then(renderCard);
    }

})

{
}



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
    event.preventDefault();
    const target = event.target;
    const dropdown = target.closest('.dropdown');
    if (dropdown){
        dropdown.classList.toggle('active');
        leftMenu.classList.add('openMenu');
        hamburger.classList.add('open');
    }
});

// открытие модального окна

tvShowList.addEventListener('click', event => {

    event.preventDefault();

    const target = event.target;
    const card = target.closest('.tv-card');
    if(card){
        preloader.style.display = 'block';
        new DBService().getTvShow(card.id)
            .then(({ poster_path: posterPath,
                name: title,
                genres,
                vote_average: voteAverage,
                overview,
                homepage }) => {
                preloader.style.display = 'none';
                tvCardImg.src = IMG_URL + posterPath;
                tvCardImg.alt = title;
                modalTitle.textContent = title;
                genresList.textContent = '';
                for (const item of genres) {
                    genresList.innerHTML += `<li>${item.name}</li>`;
                }
                rating.textContent = voteAverage;
                description.textContent = overview;
                modalLink.href = homepage;
            })
            .then(()=>{
                document.body.style.overflow = 'hidden';
                modal.classList.remove('hide');
            })
    }
});

// закрытие модального окна

modal.addEventListener('click', event => {
    if(event.target.closest('.cross') || 
    event.target.classList.contains('modal')){
        document.body.style.overflow = '';
        modal.classList.add('hide');
    }
});

// смена карточки

const changeImage = (event) => {
    const tvCard = event.target.closest('.tv-card');
    if(tvCard){
        const img = tvCard.querySelector('.tv-card__img');
        if (img.dataset.backdrop){
           [img.src, img.dataset.backdrop]=[img.dataset.backdrop, img.src];
        }
    }
};

tvShowList.addEventListener('mouseover', changeImage);
tvShowList.addEventListener('mouseout', changeImage);