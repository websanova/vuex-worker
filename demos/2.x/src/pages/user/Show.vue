<template>
    <this-load
        :status="_payload.user.fetch.form.status"
        :error-msg="(_payload.user.fetch.form.errors['general'] || {}).msg"
    >
        <div class="text-center">
            <img
                :src="_payload.user.fetch.data.avatar || '//www.gravatar.com/avatar/?d=identicon&s=200'"
                width="100"
            />

            <div
                class="text-bold py-1"
            >
                {{ _payload.user.fetch.data.first_name }} {{ _payload.user.fetch.data.last_name }}
            </div>
        </div>
    </this-load>
</template>

<script>
    import * as store from '@websanova/vuex-worker/src/helpers/store.js';
    import ThisLoad   from '../../elements/Load.vue';

    export default {
        computed: {
            _payload() {
                return store.payload(this, 'demo/user/fetch');
            }
        },

        mounted() {
            store.fetch(
                this,
                'demo/user/fetch',
                {user: {id: this.$route.params.user_id}},
                {find: {in: 'demo/user/list'}}
            );
        },

        destroyed() {
            store.clear(this, 'demo/user/fetch');
        },

        components: {
            ThisLoad,
        }
    }
</script>