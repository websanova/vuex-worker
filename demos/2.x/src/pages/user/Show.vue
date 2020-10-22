<template>
    <this-load
        :status="_payload.fetch.form.status"
        :error-msg="(_payload.fetch.form.errors['general'] || {}).msg"
    >
        <div class="text-center">
            <img
                :src="_payload.fetch.data.avatar || '//www.gravatar.com/avatar/?d=identicon&s=200'"
                width="100"
            />

            <div
                class="text-bold py-1"
            >
                {{ _payload.fetch.data.first_name }} {{ _payload.fetch.data.last_name }}
            </div>
        </div>
    </this-load>
</template>

<script>
    import * as fetch from '../../helpers/fetch.js';

    import ThisLoad   from '../../elements/Load.vue';

    export default {
        computed: {
            _worker() {
                return {
                    list: this.$store.worker('demo/user/list'),
                    fetch: this.$store.worker('demo/user/fetch'),
                };
            },

            _payload() {
                return {
                    fetch: this._worker.fetch.payload()
                };
            }
        },

        mounted() {
            fetch.mounted(
                this._worker.fetch,
                this._worker.list,
                {
                    user: {
                        id: this.$route.params.user_id
                    }
                }
            );
        },

        destroyed() {
            fetch.destroyed(this._worker.fetch);
        },

        components: {
            ThisLoad,
        }
    }
</script>