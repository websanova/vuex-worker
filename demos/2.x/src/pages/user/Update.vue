<template>
    <div>
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
                                @click="_worker.update.request()"
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
                    fetch: this.$store.worker('demo/user/fetch'),
                    update: this.$store.worker('demo/user/update'),
                };
            },

            _payload() {
                return {
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
                
                this.setUser(user);
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
                this.setUser(this._payload.fetch.data);
            },

            setUser(user) {
                this._worker
                    .update
                    .work('stage/update', {
                        user: user
                    })
                    .dispatch('reset', user);
            }
        },

        destroyed() {
            this._worker.fetch.work('clear');
            this._worker.update.work('clear');
        }
    }
</script>