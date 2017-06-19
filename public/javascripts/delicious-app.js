import '../sass/style.scss';

import { $, $$ } from './modules/bling';
import autocomplete from './modules/autocomplete';

// provides autocomplete functionality for addresses using google places
autocomplete($('#address'), $('#lat'), $('#lng'));