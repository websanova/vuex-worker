<template>
    <div>
        <table>
            <tr>
                <td>
                    First Name:
                </td>
                <td>
                    <input
                        :value="_payload.user.create.form.fields.first_name"
                        @input="input({first_name: $event.target.value})"
                    />
                    <div
                        v-if="_payload.user.create.form.errors.first_name"
                        class="text-danger text-sm"
                    >
                        {{ _payload.user.create.form.errors.first_name }}
                    </div>
                </td>
            </tr><tr>
                <td>
                    Last Name:
                </td>
                <td>
                    <input
                        :value="_payload.user.create.form.fields.last_name"
                        @input="input({last_name: $event.target.value})"
                    />
                    <div
                        v-if="_payload.user.create.form.errors.last_name"
                        class="text-danger text-sm"
                    >
                        {{ _payload.user.create.form.errors.last_name }}
                    </div>
                </td>
            </tr><tr>
                <td>
                    Email:
                </td>
                <td>
                    <input
                        :value="_payload.user.create.form.fields.email"
                        @change="input({email: $event.target.value})"
                    />
                    <div
                        v-if="_payload.user.create.form.errors.email"
                        class="text-danger text-sm"
                    >
                        {{ _payload.user.create.form.errors.email }}
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
                                @click="create"
                                :disabled="_payload.user.create.form.loading"
                            >
                                Create
                            </button>
                        </li>
                        <li>
                            <button
                                @click="reset"
                                :disabled="_payload.user.create.form.loading"
                            >
                                Reset
                            </button>
                        </li>

                        <li>
                            <span
                                v-show="_payload.user.create.form.loading"
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
    import * as store from '../../helpers/store.js';

    export default {
        computed: {
            _payload() {
                return store.payload(this, 'demo/user/create');
            }
        },

        methods: {
            reset() {
                store.clear(this, 'demo/user/create');
            },

            input(data) {
                store.form(this, 'demo/user/create', data);
            },

            create() {
                store.request(
                    this, 'demo/user/create',
                    {clear: true, push: {name: 'user-list'}}
                );
            }
        }
    }
</script>