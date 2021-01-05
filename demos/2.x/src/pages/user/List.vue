<template>
    <div>
        <this-list
            :show-create-button="true"
            :items="_payload.list.data.items"
            :total="_payload.list.data.total"
            :per-page="_payload.list.data.per_page"
            :current-page="_payload.list.data.current_page"
            :status="_payload.list.form.status"
            :filters="_payload.list.filter.data"
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
    import * as list     from '../../helpers/list.js';
    import * as undelete from '../../helpers/undelete.js';
    
    import ThisList      from '../../elements/List.vue';
    import ThisUserItem  from '../../elements/UserItem.vue';

    export default {
        computed: {
            _payload() {
                return {
                    list: {
                        data: this.$store.getters['demo/user/list/worker/data'],
                        form: this.$store.getters['demo/user/list/worker/form'],
                        filter: this.$store.getters['demo/user/list/worker/filter']
                    }
                };
            }
        },

        beforeCreate() {
            list.reset(this, 'demo/user/list');
        },

        mounted() {
            list.init(this, 'demo/user/list', {
                page: this.$route.query.page,
                role: this.$route.query.role,
                state: this.$route.query.state,
                query: this.$route.query.query,
            });
        },

        destroyed() {
            // NOTE: We can clear the worker if we want a reset
            //       upon return to the page from another page.
            //       Otherwise the data will stay in our store.

            // list.clear(this._worker.list);
        },

        methods: {
            filter(data) {
                list.filter(this, 'demo/user/list', data);
            },

            request(data) {
                list.request(this, 'demo/user/list', data);
            },

            undelete(data) {
                undelete.request(this, 'demo/user/undelete', data);
            }
        },

        components: {
            ThisList,
            ThisUserItem,
        }
    }
</script>