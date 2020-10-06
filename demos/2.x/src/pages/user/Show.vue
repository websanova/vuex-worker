<template>
    <div class="text-center">
        <div
            v-if="_payload.form.loading && !_payload.form.silent"
        >
            <span class="spinner">
                Loading...
            </span>
        </div>

        <div
            v-else-if="_payload.form.status === 'success'"
        >
            <img
                :src="_payload.data.avatar || '//www.gravatar.com/avatar/?d=identicon&s=200'"
                width="100"
            />

            <div
                class="text-bold py-1"
            >
                {{ _payload.data.first_name }} {{ _payload.data.last_name }}
            </div>
        </div>

        <div
            v-else
        >
            There was an issue loading the user.

            <div
                class="text-danger py-2"
            >
                {{ _payload.form.errors['general'] }}
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        computed: {
            _worker() {
                return this.$store.worker('demo/user/fetch');
            },

            _payload() {
                return this._worker.payload();
            }
        },

        mounted() {
            this._worker
                .work('stage/update', {
                    user: {
                        id: this.$route.params.user_id
                    }
                })
                .request();
        },

        destroyed() {
            this._worker.work('clear');
        }
    }
</script>