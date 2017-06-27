import axios from 'axios';
import dompurify from 'dompurify';

let searchInput, 
    searchResults;

const getSearchElements = (element) => {
    searchInput = element.querySelector('input[name="search"]');
    searchResults = element.querySelector('.search__results');
};

const buildSearchResultsHtml = (stores) => {
    return stores
        .map(store => {
            return `
            <a href="/stores/${store.slug}" class="search__result">
                <strong>${store.name}</strong>
            </a>
        `;
        })
        .join('');
};

const showSearchResults = (html) => {
    searchResults.innerHTML = dompurify.sanitize(html);
    searchResults.style.display = 'block';
};

const hideSearchResults = () => {
    searchResults.innerHTML = dompurify.sanitize('');
    searchResults.style.display = 'none';
};

const handleKeyboardInput = (searchElement) => {
    const validKeys = [ 'ArrowUp', 'ArrowDown', 'Enter' ];

    searchInput.on('keyup', (e) => {
        if (!validKeys.includes(e.key)) {
            return;
        }
        
        const activeClass = 'search__result--active';
        const current = searchElement.querySelector(`.${activeClass}`);
        const items = searchElement.querySelectorAll('.search__result');
        let next;

        if (e.key === 'ArrowDown' && current) {
            next = current.nextElementSibling || items[0];
        } else if (e.key === 'ArrowDown') {
            next = items[0];
        } else if (e.key === 'ArrowUp' && current) {
            next = current.previousElementSibling || items[items.length - 1];
        } else if (e.key === 'ArrowUp') {
            next = items[items.length - 1];
        } else if (e.key === 'Enter' && current.href) {
            window.location = current.href;

            return;
        } else if (e.key === 'Enter') {
            return;
        }

        if (current) {
            current.classList.remove(activeClass);
        }

        next.classList.add(activeClass);

        if (!searchInput.value) {
            hideSearchResults();
        } 
    });
};

const getSearchResults = (query) => {
    return axios
        .get(`/api/search?q=${query}`)
        .catch((error) => {
            console.error('Error occurred while searching', error);
        });
};

const renderSearchResults = (response, query) => {
    if (response.data.length) {
        const html = buildSearchResultsHtml(response.data);

        showSearchResults(html);

        return;
    }

    if (query) {
        showSearchResults(`<div class="search__result">
                    No result found for <strong>${query}</strong> found!</div>`);
    }
};

const onSearch = () => {
    searchInput
        .on('input', (e) => {
            const query = e.srcElement.value;

            if (!query) {
                hideSearchResults();

                return;
            }

            getSearchResults(query)
                .then((res) => {
                    renderSearchResults(res, query);
                });
        });
};

const hideSearchResultsWhenClickedOutside = () => {
    document.on('click', (e) => {
        if (e.srcElement !== searchInput) {
            hideSearchResults();
        }
    });
};

const showSearchResultsWhenInputHasValue = () => {
    searchInput.on('click', () => {
        if (searchInput.value) {
            getSearchResults(searchInput.value)
                .then((res) => {
                    renderSearchResults(res, searchInput.value);
                });
        }
    });
};

function typeAhead(searchElement) {
    if (!searchElement) 
        return;

    getSearchElements(searchElement);
    onSearch();
    handleKeyboardInput(searchElement);
    hideSearchResultsWhenClickedOutside();
    showSearchResultsWhenInputHasValue();
}

export default typeAhead;