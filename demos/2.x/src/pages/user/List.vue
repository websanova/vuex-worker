<template>
    <div>
        <this-list
            :show-create-button="true"
            :items="_payload.user.list.data.items"
            :total="_payload.user.list.data.total"
            :per-page="_payload.user.list.data.per_page"
            :current-page="_payload.user.list.data.current_page"
            :status="_payload.user.list.form.status"
            :filters="_payload.user.list.filter.data"
            @create="$router.push({name: 'user-create'})"
            @refresh="request"
            @silent="request({silent: true})"
            @filter="filter"
        >
            <this-user-item
                slot="item"
                slot-scope="{item}"
                :key="item.id"
                :id="item.id"
                :avatar="item.avatar"
                :first-name="item.first_name"
                :last-name="item.last_name"
                :is-active="item.is_active"
                @view="$router.push({name: 'user-show', params: {user_id: item.id}})"
                @update="$router.push({name: 'user-update', params: {user_id: item.id}})"
                @undelete="undelete({user: item})"
            />
        </this-list>
    </div>
</template>

<script>
    import * as store   from '@websanova/vuex-worker/src/helpers/store.js';
    import ThisList     from '../../elements/List.vue';
    import ThisUserItem from '../../elements/UserItem.vue';

    export default {
        computed: {
            _payload() {
                return store.payload(this, 'demo/user/list');
            }
        },

        mounted() {
            store.reset(this, 'demo/user/list', {
                page: this.$route.query.page,
                role: this.$route.query.role,
                state: this.$route.query.state,
                query: this.$route.query.query,
            });

            store.request(this, 'demo/user/list');

            store.filterPath(this, 'demo/user/list', true);
        },

        destroyed() {
            // NOTE: We can clear the worker if we want a reset
            //       upon return to the page from another page.
            //       Otherwise the data will stay in our store.

            // store.clear(this, 'demo/user/list');
        },

        methods: {
            filter(data) {
                store.filterAndRequest(this, 'demo/user/list', data);

                store.filterPath(this, 'demo/user/list');
            },

            request(data) {
                store.request(this, 'demo/user/list', data);
            },

            undelete(data) {
                store.stageAndRequest(this, 'demo/user/undelete', data);
            }
        },

        components: {
            ThisList,
            ThisUserItem,
        }
    }
</script>