<template>
    <this-load
        :status="_payload.fetch.form.status"
    >
        <div class="media m-0">
            <div class="media-middle">
                <span class="text-bold">
                    {{ _payload.fetch.data.first_name }} {{ _payload.fetch.data.last_name }} 
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
                <td
                    class="text-center"
                >
                    <img
                        :src="_payload.fetch.data.avatar || '//www.gravatar.com/avatar/?d=identicon&s=200'"
                        width="50"
                        class="mb-3"
                    />
                </td>
                <td>
                    <span
                        v-if="_payload.avatar.form.loading"
                        class="spinner"
                    >Uploading...</span>

                    <button
                        v-else
                        @click="avatar"
                    >
                        Update Avatar
                    </button>
                </td>
            </tr><tr>
                <td>
                    First Name:
                </td>
                <td>
                    <input
                        :value="_payload.update.form.fields.first_name"
                        @change="_worker.update.work('form/update', {first_name: $event.target.value})"
                    />
                    <div
                        v-if="_payload.update.form.errors.first_name"
                        class="text-danger text-sm"
                    >
                        {{ _payload.update.form.errors.first_name }}
                    </div>
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
                    <div
                        v-if="_payload.update.form.errors.first_name"
                        class="text-danger text-sm"
                    >
                        {{ _payload.update.form.errors.first_name }}
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
                                :disabled="_payload.update.form.loading"
                            >
                                Update
                            </button>
                        </li>
                        <li>
                            <button
                                @click="reset(_payload.fetch.data)"
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
    </this-load>
</template>

<script>
    import * as fetch  from '../../helpers/fetch.js';
    import * as update from '../../helpers/update.js';
    import * as deleat from '../../helpers/delete.js';

    import ThisLoad    from '../../elements/Load.vue';

    export default {
        computed: {
            _worker() {
                return {
                    list: this.$store.worker('demo/user/list'),
                    fetch: this.$store.worker('demo/user/fetch'),
                    update: this.$store.worker('demo/user/update'),
                    delete: this.$store.worker('demo/user/delete'),
                    avatar: this.$store.worker('demo/user/avatar'),
                };
            },

            _payload() {
                return {
                    list: this._worker.list.payload(),
                    fetch: this._worker.fetch.payload(),
                    update: this._worker.update.payload(),
                    avatar: this._worker.avatar.payload(),
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
            )
            .then((data) => {
                this.reset(data);
            });
        },

        methods: {
            reset(data) {
                update.reset(this._worker.update, {user: data});
            },

            update() {
                update.request(this._worker.update);
            },

            avatar() {
                this._worker
                    .avatar
                    .work('stage/update', {user: this._payload.fetch.data})
                    .dispatch('send');
            },

            delete() {
                deleat
                    .request(this._worker.delete, {user: this._payload.fetch.data})
                    .then(() => {
                        this.$router.push({
                            name: 'user-list',
                        });
                    });
            }
        },

        destroyed() {
            fetch.destroyed(this._worker.fetch);
            update.destroyed(this._worker.update);
        },

        components: {
            ThisLoad
        }
    }
</script>