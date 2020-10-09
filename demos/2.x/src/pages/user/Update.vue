<template>
    <div>
        <div class="media m-0">
            <div>
                <span
                    v-show="_payload.fetch.form.loading"
                    class="spinner"
                />

                <span class="text-bold">
                    {{ _payload.fetch.data.first_name }} {{ _payload.fetch.data.last_name }} 
                </span>

                &#8203;
            </div>

            <div class="media-tight">
                <button
                    @click="userDelete"
                >
                    delete
                </button>
            </div>
        </div>

        <hr/>

        <table>
            <tr>
                <td>
                    First Name:
                </td>
                <td>
                    <input
                        :value="_payload.update.form.fields.first_name"
                        @change="_worker.update.work('form/update', {first_name: $event.target.value})"
                    />
                </td>
            </tr><tr>
                <td>
                    Last Name:
                </td>
                <td>
                    <input
                        :value="_payload.update.form.fields.last_name"
                        @change="_worker.update.work('form/update', {last_name: $event.target.value})"
                    />
                </td>
            </tr><tr>
                <td></td>

                <td>
                    <ul
                        class="spacer"
                    >
                        <li>
                            <button
                                @click="userUpdate"
                                :disabled="_payload.update.form.loading"
                            >
                                Update
                            </button>
                        </li>
                        <li>
                            <button
                                @click="reset"
                                :disabled="_payload.update.form.loading"
                            >
                                Reset
                            </button>
                        </li>

                        <li>
                            <span
                                v-show="_payload.update.form.loading"
                                class="spinner"
                            />
                        </li>
                    </ul>
                </td>
            </tr>
        </table>
    </div>
</template>

<script>
    export default {
        computed: {
            _worker() {
                return {
                    list: this.$store.worker('demo/user/list'),
                    fetch: this.$store.worker('demo/user/fetch'),
                    update: this.$store.worker('demo/user/update'),
                    delete: this.$store.worker('demo/user/delete'),
                };
            },

            _payload() {
                return {
                    list: this._worker.list.payload(),
                    fetch: this._worker.fetch.payload(),
                    update: this._worker.update.payload(),
                };
            }
        },

        mounted() {
            var data = {
                id: this.$route.params.user_id
            };
            
            var user = this.$store.getters['demo/user/list/worker/find'](data);

            if (user) {
                this._worker.fetch.work('data', user);
                
                this.userReset(user);
            }
            else {
                this._worker
                    .fetch
                    .work('stage/update', {user: data})
                    .request()
                    .then(() => {
                        this.reset();
                    });
            }
        },

        methods: {
            reset() {
                this.userReset(this._payload.fetch.data);
            },

            userReset(user) {
                this._worker
                    .delete
                    .work('stage/update', {
                        user: user
                    });

                this._worker
                    .update
                    .work('stage/update', {
                        user: user
                    })
                    .dispatch('reset', user);
            },

            userUpdate() {
                this._worker.update.request();
            },

            userDelete() {
                this._worker
                    .delete
                    .request()
                    .then(() => {
                        this.$router.push({
                            name: 'user-list',
                        });
                    });
            }
        },

        destroyed() {
            this._worker.fetch.work('clear');
            this._worker.update.work('clear');
        }
    }
</script>