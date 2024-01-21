import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import axios from 'axios';

const refs = {
  searchFormElement: document.querySelector('.search-form'),
  searchInput: document.querySelector('.search-input'),
  searchBtn: document.querySelector('.search-btn'),
  imagesMarkUp: document.querySelector('.images-markup'),
  loadBtn: document.querySelector('.load-btn'),
};

const API_KEY = '41860696-2902f93b7313ed5ba840414ce';

const PER_PAGE = 40;

let gallery = new SimpleLightbox('.small-image-item a');

let query = '';

let numOfPage;

const instance = axios.create({
  baseURL: 'https://pixabay.com/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});

refs.searchFormElement.addEventListener('submit', searchQuery);
refs.loadBtn.addEventListener('click', onLoadMore);

function searchQuery(e) {
  e.preventDefault();
  numOfPage = 1;
  refs.imagesMarkUp.innerHTML = ``;
  query = refs.searchInput.value.toLowerCase();
  refs.imagesMarkUp.insertAdjacentHTML(
    'beforeend',
    `<li class="loader-item"><span class="loader"></span></li>`
  );
  fetchImages();
}

function onBadQuery() {
  refs.imagesMarkUp.innerHTML = ``;

  iziToast.error({
    theme: 'dark',
    position: 'topRight',
    maxWidth: '392px',
    messageSize: '16px',
    messageLineHeight: '24px',
    backgroundColor: '#EF4040',
    messageColor: '#FAFAFB',
    message:
      'Sorry, there are no images matching your search query. Please, try again!',
    progressBarColor: '#B51B1B',
  });
}

function onRequestError(error) {
  refs.imagesMarkUp.innerHTML = ``;
  refs.loadBtn.classList.add('hidden');
  iziToast.error({
    theme: 'dark',
    position: 'topRight',
    maxWidth: '392px',
    messageSize: '16px',
    messageLineHeight: '24px',
    backgroundColor: '#EF4040',
    messageColor: '#FAFAFB',
    message: `Something went wrong:: ${error}`,
    progressBarColor: '#B51B1B',
  });
}

function checkLimit(limit) {
  if (refs.imagesMarkUp.childNodes.length >= limit) {
    refs.loadBtn.classList.add('hidden');
    refs.imagesMarkUp.insertAdjacentHTML(
      'beforeend',
      `<p class="limit-message">We're sorry, but you've reached the end of search results.</p>`
    );
    return;
  }
}

function renderMarkUp(data) {
  document.querySelector('.loader-item').remove();
  const markUp = data.hits.reduce(
    (html, image) =>
      html +
      `<li class="small-image-item"><a href="${image.largeImageURL}"><img src="${image.webformatURL}" class="small-image" alt="${image.tags}" /></a><ul class="description-image-list"><li class="description-image-item"><p class="description-title">Likes</p><p class="description-value">${image.likes}</p></li>
          <li class="description-image-item"><p class="description-title">Views</p><p class="description-value">${image.views}</p></li>
          <li class="description-image-item"><p class="description-title">Comments</p><p class="description-value">${image.comments}</p></li>
          <li class="description-image-item"><p class="description-title">Downloads</p><p class="description-value">${image.downloads}</p></li></ul></li>`,
    ''
  );
  refs.imagesMarkUp.insertAdjacentHTML('beforeend', markUp);

  checkLimit(data.totalHits);

  gallery.refresh();
}

async function onLoadMore() {
  numOfPage += 1;
  refs.imagesMarkUp.insertAdjacentHTML(
    'beforeend',
    `<li class="loader-item"><span class="loader"></span></li>`
  );

  await fetchImages();

  window.scrollBy({
    top:
      document.querySelector('.small-image-item').getBoundingClientRect()
        .height * 2,
    left: 0,
    behavior: 'smooth',
  });
}

async function fetchImages() {
  refs.loadBtn.classList.add('hidden');
  try {
    const response = await instance.get(
      `?key=${API_KEY}&q=${query}&image-type=photo&orientation=horizontal&safesearch=true&page=${numOfPage}&per_page=${PER_PAGE}`
    );
    const responseData = await response.data;

    if (responseData.hits.length <= 0) {
      onBadQuery();
      return;
    }
    refs.loadBtn.classList.remove('hidden');
    renderMarkUp(responseData);
  } catch (e) {
    onRequestError(e.message);
  }
}
