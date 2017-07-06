import '../sass/style.scss';

import { $, $$ } from './modules/bling';
import autocomplete from './modules/autocomplete';
import typeAhead from './modules/typeAhead';
import makeMap from './modules/map';
import saveFavouriteStore from './modules/favouriteStores';

// provides autocomplete functionality for addresses using google places
autocomplete($('#address'), $('#lat'), $('#lng'));
// search 
typeAhead($('.search'));

makeMap($('#map'));

const favForms = $$('form.heart');

favForms.on('submit', saveFavouriteStore);