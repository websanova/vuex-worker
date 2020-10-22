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
            _worker() {
                return {
                    list: this.$store.worker('demo/user/list'),
                    undelete: this.$store.worker('demo/user/undelete'),
                };
            },

            _payload() {
                return {
                    list: this._worker.list.payload(),
                };
            }
        },

        mounted() {
            list.mounted(this._worker.list, {
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

            // list.destroyed(this._worker.list);
        },

        methods: {
            filter(data) {
                list.filter(this._worker.list, data);
            },

            request(data) {
                list.request(this._worker.list, data);
            },

            undelete(data) {
                undelete.request(this._worker.undelete, data);
            }
        },

        components: {
            ThisList,
            ThisUserItem,
        }
    }
</script>