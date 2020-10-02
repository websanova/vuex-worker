import Vue       from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

function loadView(view) {
    return () => import(`../pages/${view}.vue`);
}

Vue.router = new VueRouter({
    hashbang: false,
    mode: 'history',
    base: __dirname,
    routes: [{
        path: '/',
        redirect: {
            name: 'user-list'
        }
    }, {
        path: '/list',
        name: 'user-list',
        component: loadView('user/List'),
    }]
});

export default Vue.router;