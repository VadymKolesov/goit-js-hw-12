import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

let gallery = new SimpleLightbox('.small-image-item a');

const refs = {
  searchFormElement: document.querySelector('.search-form'),
  searchInput: document.querySelector('.search-input'),
  searchBtn: document.querySelector('.search-btn'),
  imagesMarkUp: document.querySelector('.images-markup'),
};

const BASE_URL = 'https://pixabay.com/api/';
const KEY = '41860696-2902f93b7313ed5ba840414ce';

let query = '';

refs.searchFormElement.addEventListener('submit', searchQuery);

function searchQuery(e) {
  e.preventDefault();
  query = refs.searchInput.value.toLowerCase();
  refs.imagesMarkUp.innerHTML = `<li><span class="loader"></span></li>`;
  fetchImages();
}

function fetchImages() {
  fetch(
    `${BASE_URL}?key=${KEY}&q=${query}&image-type=photo&orientation=horizontal&safesearch=true&per_page=21`
  )
    .then(r => {
      return r.json();
    })
    .then(data => {
      if (data.hits.length === 0) {
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
        return;
      }
      const markUp = data.hits.reduce(
        (html, image) =>
          html +
          `<li class="small-image-item"><a href="${image.largeImageURL}"><img src="${image.webformatURL}" class="small-image" alt="${image.tags}" /></a><ul class="description-image-list"><li class="description-image-item"><p class="description-title">Likes</p><p class="description-value">${image.likes}</p></li>
          <li class="description-image-item"><p class="description-title">Views</p><p class="description-value">${image.views}</p></li>
          <li class="description-image-item"><p class="description-title">Comments</p><p class="description-value">${image.comments}</p></li>
          <li class="description-image-item"><p class="description-title">Downloads</p><p class="description-value">${image.downloads}</p></li></ul></li>`,
        ''
      );
      refs.imagesMarkUp.innerHTML = markUp;
    })
    .catch(error => {
      refs.imagesMarkUp.innerHTML = ``;
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
    })
    .finally(e => {
      gallery.refresh();
    });
}
