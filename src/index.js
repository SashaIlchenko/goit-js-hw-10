import './css/styles.css';
import { Notify } from "notiflix";
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;
const inputEl = document.querySelector('#search-box');
const listEl = document.querySelector('.country-list');
const infoEl = document.querySelector('.country-info');

inputEl.addEventListener('input', debounce(onChangeInput, DEBOUNCE_DELAY));

function onChangeInput(e) {

    const name = e.target.value.trim();
    if (name) {
        fetchCountries(name)
            .then(data => createMarkup(data))
            .catch(error => onError(error));
    }

}
function createMarkup(obj) {
    if (obj.length === 1) {

        const markup = obj.map(({
            flags: { svg },
            name: { official },
            capital, population,
            languages,
        }) => `<h2><img class='flag-icon' src=${svg} alt='flag of ${official}' width = '30'> ${official}</h2>
        <ul><li>Capital: ${capital}</li><li>Population: ${population}</li><li> Languages: ${Object.values(languages)}`)
        listEl.innerHTML = '';
        infoEl.innerHTML = markup.join('');


    }
    else if (obj.length > 1 && obj.length <= 10) {

        const markup = obj.map(({
            flags: { svg },
            name: { official }
        }) => `<li class='list-item'><img class='flag-icon' src=${svg} alt='flag of ${official}' width = '20'> ${official}</li>`)
        listEl.innerHTML = markup.join('');
        infoEl.innerHTML = '';

    } else {
        listEl.innerHTML = '';
        infoEl.innerHTML = '';
        Notify.info('Too many matches found. Please enter a more specific name.')
    }

}

function onError() {
    Notify.failure("Oops, there is no country with that name");
}