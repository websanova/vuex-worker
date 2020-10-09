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
                            v-show="_payload.list.form.loading"
                            class="spinner"
                        />
                    </li>
                </ul>
            </div>

            <div class="media-tight">
                <ul class="spacer">
                    <li>
                        <select
                            :value="_payload.list.filter.fields.role"
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
                            :value="_payload.list.filter.fields.state"
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
            v-if="_payload.list.form.loading && !_payload.list.form.silent"
        >
            <span class="spinner">
                Loading...
            </span>
        </div>

        <div
            v-else
        >
            <div
                v-for="user in _payload.list.data.items"
                :key="user.id"
                class="media"
            >
                <div class="media-tight">
                    <img :src="user.avatar || '//www.gravatar.com/avatar/?d=identicon&s=200'" width="25" />
                </div>

                <div class="media-middle px-2">
                    {{ user.id }} : {{ user.first_name }} {{ user.last_name }}
                </div>

                <div class="media-tight media-middle">
                    <ul class="spacer spacer-pipe text-sm">
                        <li
                            v-if="user.is_active"
                        >
                            <router-link
                                :to="{name: 'user-show', params: {user_id: user.id}}"
                            >
                                show
                            </router-link>
                        </li>

                        <li
                            v-if="user.is_active"
                        >
                            <router-link
                                :to="{name: 'user-update', params: {user_id: user.id}}"
                            >
                                update
                            </router-link>
                        </li>

                        <li
                            v-if="!user.is_active"
                        >
                            <span
                                class="text-link"
                                @click="undelete(user)"
                            >
                                undelete
                            </span>
                        </li>
                    </ul>
                </div>
            </div>

            <div
                v-if="!(_payload.list.data.items || []).length"
            >
                No results.
            </div>
        </div>

        <div
            v-if="_pages > 1"
        >
            <hr />

            <span
                v-for="i in _pages"
                class="mx-1 px-1 text-link"
                v-bind:class="[i === _payload.list.data.current_page ? 'active' : '']"
                @click="filter({page: i})"
            >
                {{ i }}
            </span>
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
            },

            _pages() {
                return Math.ceil(this._payload.list.data.total / this._payload.list.data.per_page);
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
            var query = this._payload.list.filter.query;

            if (this._payload.list.form.status === null) {
                this.filter({
                    page: this.$route.query.page,
                    role: this.$route.query.role,
                    state: this.$route.query.state,
                    query: this.$route.query.query,
                });
            }
            else if (Object.keys(query).length) {
                this.$router.replace({
                    query: query
                });
            }
        },

        destroyed() {
            // NOTE: We can clear the worker if we want a reset
            //       upon return to the page from another page.
            //       Otherwise the data will stay in our store.

            // this._worker.list.work('clear');
        },

        methods: {
            filter(data) {
                this._worker
                    .list
                    .work('filter/update', data)
                    .request();
            },

            request(data) {
                this._worker.list.request(data);
            },

            undelete(user) {
                this._worker
                    .undelete
                    .work('stage/update', {user: user})
                    .request();
            }
        }
    }
</script>