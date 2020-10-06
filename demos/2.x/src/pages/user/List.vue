<template>
    <div>
        <div class="media">
            <div>
                <ul class="spacer">
                    <li>
                        <button
                            @click="request()"
                        >
                            Refresh
                        </button>
                    </li>

                    <li>
                        <button
                            @click="request({silent: true})"
                        >
                            Silent
                        </button>
                    </li>

                    <li>
                        <span
                            v-show="_payload.form.loading"
                            class="spinner"
                        />
                    </li>
                </ul>
            </div>

            <div class="media-tight">
                <ul class="spacer">
                    <li>
                        <select
                            :value="_payload.filter.fields.role"
                            @change="filter({role: $event.target.value})"
                        >
                            <option value="">All Roles</option>
                            <option value="super">Super</option>
                            <option value="editor">Editor</option>
                            <option value="user">User</option>
                        </select>
                    </li>

                    <li>
                        <select
                            :value="_payload.filter.fields.state"
                            @change="filter({state: $event.target.value})"
                        >
                            <option value="">All States</option>
                            <option value="active">Active</option>
                            <option value="deleted">Deleted</option>
                        </select>
                    </li>
                </ul>
            </div>
        </div>

        <hr/>

        <div
            v-if="_payload.form.loading && !_payload.form.silent"
        >
            <span class="spinner">
                Loading...
            </span>
        </div>

        <div
            v-else
            v-for="user in _payload.data.items"
            :key="user.id"
            class="media"
        >
            <div class="media-tight">
                <img :src="user.avatar || '//www.gravatar.com/avatar/?d=identicon&s=200'" width="25" />
            </div>

            <div class="media-middle px-2">
                {{ user.id }} : {{ user.first_name }}
            </div>

            <div class="media-tight media-middle">
                <ul class="spacer spacer-pipe text-sm">
                    <li>
                        <router-link
                            :to="{name: 'user-show', params: {user_id: user.id}}"
                        >
                            show
                        </router-link>
                    </li>

                    <li>
                        <router-link
                            :to="{name: 'user-update', params: {user_id: user.id}}"
                        >
                            update
                        </router-link>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                
            };
        },

        computed: {
            _worker() {
                return this.$store.worker('demo/user/list');
            },

            _payload() {
                return this._worker.payload();
            }
        },

        watch: {
            '$route.query.page'(val) {
                this.filter({page: val});
            },

            '$route.query.role'(val) {
                this.filter({role: val});
            },

            '$route.query.state'(val) {
                this.filter({state: val});
            },

            '$route.query.query'(val) {
                this.filter({query: val});
            }
        },

        mounted() {
            this.filter({
                page: this.$route.query.page,
                role: this.$route.query.role,
                state: this.$route.query.state,
                query: this.$route.query.query,
            });
        },

        destroyed() {
            this._worker.work('clear');
        },

        methods: {
            filter(data) {
                this._worker
                    .work('filter/update', data)
                    .request();
            },

            request(data) {
                this._worker.request(data);
            }
        }
    }
</script>