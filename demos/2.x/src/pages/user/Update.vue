<template>
    <this-load
        :status="_payload.user.fetch.form.status"
    >
        <div class="media m-0">
            <div class="media-middle">
                <span class="text-bold">
                    {{ _payload.user.fetch.data.first_name }} {{ _payload.user.fetch.data.last_name }} 
                </span>

                &#8203;
            </div>

            <div class="media-tight">
                <button
                    @click="this.delete"
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
                        :value="_payload.user.update.form.fields.first_name"
                        @input="input({first_name: $event.target.value})"
                    />
                    <div
                        v-if="_payload.user.update.form.errors.first_name"
                        class="text-danger text-sm"
                    >
                        {{ _payload.user.update.form.errors.first_name }}
                    </div>
                </td>
            </tr><tr>
                <td>
                    Last Name:
                </td>
                <td>
                    <input
                        :value="_payload.user.update.form.fields.last_name"
                        @input="input({last_name: $event.target.value})"
                    />
                    <div
                        v-if="_payload.user.update.form.errors.first_name"
                        class="text-danger text-sm"
                    >
                        {{ _payload.user.update.form.errors.first_name }}
                    </div>
                </td>
            </tr><tr>
                <td></td>

                <td>
                    <ul
                        class="spacer"
                    >
                        <li>
                            <button
                                @click="update"
                                :disabled="_payload.user.update.form.loading"
                            >
                                Update
                            </button>
                        </li>
                        <li>
                            <button
                                @click="reset"
                                :disabled="_payload.user.update.form.loading"
                            >
                                Reset
                            </button>
                        </li>

                        <li>
                            <span
                                v-show="_payload.user.update.form.loading"
                                class="spinner"
                            />
                        </li>
                    </ul>
                </td>
            </tr>
        </table>
    </this-load>
</template>

<script>
    import * as store from '@websanova/vuex-worker/src/helpers/store.js';
    import ThisLoad   from '../../elements/Load.vue';

    export default {
        computed: {
            _payload() {
                return store.payload(this, ['demo/user/fetch', 'demo/user/update']);
            }
        },

        mounted() {
            store.fetch(
                this,
                'demo/user/fetch',
                {user: {id: this.$route.params.user_id}},
                {find: {in: 'demo/user/list'}}
            )
            .then(() => {
                this.reset();
            });
        },

        methods: {
            reset(data) {
                store.reset(this, 'demo/user/update', {user: this._payload.user.fetch.data});
            },

            input(data) {
                store.form(this, 'demo/user/update', data);
            },

            update() {
                store.stageAndRequest(
                    this,
                    'demo/user/update',
                    {user: this._payload.user.fetch.data}
                );
            },

            delete() {
                store
                .stageAndRequest(
                    this,
                    'demo/user/delete',
                    {user: this._payload.user.fetch.data},
                )
                .then(() => {
                    this.$router.push({name: 'user-list'});
                });
            }
        },

        destroyed() {
            store.clear(this, ['demo/user/fetch', 'demo/user/update']);
        },

        components: {
            ThisLoad
        }
    }
</script>