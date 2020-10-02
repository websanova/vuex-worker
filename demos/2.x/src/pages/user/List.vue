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
                            @change="filter({role: $event})"
                        >
                            <option value="">All Roles</option>
                            <option value="super">Super</option>
                            <option value="editor">Editor</option>
                            <option value="user">User</option>
                        </select>
                    </li>

                    <li>
                        <select
                            @change="filter({state: $event})"
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
                <ul class="spacer spacer-pipe txt-sm">
                    <li>
                        <a
                            @click=""
                        >
                            update
                        </a>
                    </li>

                    <li>
                        <a
                            @click=""
                        >
                            delete
                        </a>
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

        mounted() {
            this.request();
        },

        methods: {
            request(data) {
                this._worker.request(data);
            },

            filter(data) {
                this._worker
                    .work('filter/update', data)
                    .request();
            }
        }
    }
</script>