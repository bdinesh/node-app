import axios from 'axios';
import { $ } from './bling';

const saveFavoriteStore = (e) => {
    e.preventDefault();
    const form = e.srcElement;

    axios
        .post(form.action)
        .then(res => {
            const isFav = form.heart.classList.toggle('heart__button--hearted');

            $('.heart-count').textContent = res.data.favoriteStores.length;

            if (isFav) {
                form.heart.classList.add('heart__button--float');
                setTimeout(() => {
                    form.heart.classList.remove('heart__button--float');
                }, 2000);
            }
        })
        .catch(console.error);
};

export default saveFavoriteStore;