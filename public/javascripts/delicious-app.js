import '../sass/style.scss';

import { $, $$ } from './modules/bling';
import autocomplete from './modules/autocomplete';
import typeAhead from './modules/typeAhead';

// provides autocomplete functionality for addresses using google places
autocomplete($('#address'), $('#lat'), $('#lng'));
// search 
typeAhead($('.search'));