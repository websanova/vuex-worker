import Vue  from 'vue';
import Vuex from '@websanova/vuex-worker';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
    modules: {

    },
  
    strict: debug
});