<template>
    <div>
        <this-list
            :data="_payload.list.data"
            :status="_payload.list.form.status"
            :filters="_payload.list.filter.data"
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
                :first_name="item.first_name"
                :last_name="item.last_name"
                :is_active="item.is_active"
                @view="$router.push({name: 'user-show', params: {user_id: item.id}})"
                @update="$router.push({name: 'user-update', params: {user_id: item.id}})"
                @undelete="undelete(item)"
            />
        </this-list>
    </div>
</template>

<script>
    import mxnList      from '../../mixins/list.js';
    import ThisList     from '../../elements/List.vue';
    import ThisUserItem from '../../elements/UserItem.vue';

    export default {

        // TODO: Would be better to use Vue 3 composable here to import
        //       specific functions we need as this could get messy fast.

        mixins: [mxnList({
            clearOnDestroy: false
        })],

        computed: {
            _worker() {
                return {
                    list: this.$store.worker('demo/user/list'),
                    undelete: this.$store.worker('demo/user/undelete'),
                }
            },

            _payload() {
                return {
                    list: this._worker.list.payload(),
                    undelete: this._worker.undelete.payload(),
                }
            }
        },

        components: {
            ThisList,
            ThisUserItem,
        }
    }
</script>