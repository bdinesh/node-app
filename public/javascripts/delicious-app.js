import '../sass/style.scss';

import { $, $$ } from './modules/bling';
import autocomplete from './modules/autocomplete';
import typeAhead from './modules/typeAhead';
import makeMap from './modules/map';

// provides autocomplete functionality for addresses using google places
autocomplete($('#address'), $('#lat'), $('#lng'));
// search 
typeAhead($('.search'));

makeMap($('#map'));