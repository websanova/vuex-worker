import Vue  from 'vue';
import Vuex from '@websanova/vuex-worker';

import demo from './modules/demo';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
    modules: {
        demo
    },
  
    strict: debug
});