import Vue             from 'vue'
import upload          from '@websanova/vue-upload/src/v2.js';
import httpAxios       from '@websanova/vue-upload/src/drivers/http/axios.js';

Vue.use(upload, {
    plugins: {
        http: Vue.axios
    },
    drivers: {
        http: httpAxios,
    }
});