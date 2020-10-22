<template>
    <div>
        <table>
            <tr>
                <td>
                    First Name:
                </td>
                <td>
                    <input
                        :value="_payload.create.form.fields.first_name"
                        @change="_worker.create.work('form/update', {first_name: $event.target.value})"
                    />
                    <div
                        v-if="_payload.create.form.errors.first_name"
                        class="text-danger text-sm"
                    >
                        {{ _payload.create.form.errors.first_name }}
                    </div>
                </td>
            </tr><tr>
                <td>
                    Last Name:
                </td>
                <td>
                    <input
                        :value="_payload.create.form.fields.last_name"
                        @change="_worker.create.work('form/update', {last_name: $event.target.value})"
                    />
                    <div
                        v-if="_payload.create.form.errors.last_name"
                        class="text-danger text-sm"
                    >
                        {{ _payload.create.form.errors.last_name }}
                    </div>
                </td>
            </tr><tr>
                <td>
                    Email:
                </td>
                <td>
                    <input
                        :value="_payload.create.form.fields.email"
                        @change="_worker.create.work('form/update', {email: $event.target.value})"
                    />
                    <div
                        v-if="_payload.create.form.errors.email"
                        class="text-danger text-sm"
                    >
                        {{ _payload.create.form.errors.email }}
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
                                :disabled="_payload.create.form.loading"
                            >
                                Create
                            </button>
                        </li>
                        <li>
                            <button
                                @click="reset"
                                :disabled="_payload.create.form.loading"
                            >
                                Reset
                            </button>
                        </li>

                        <li>
                            <span
                                v-show="_payload.create.form.loading"
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
                    create: this.$store.worker('demo/user/create'),
                };
            },

            _payload() {
                return {
                    create: this._worker.create.payload(),
                };
            }
        },

        methods: {
            reset() {
                this._worker.create.work('clear');
            },

            create() {
                this._worker
                    .create
                    .request()
                    .then(() => {
                        this.reset();

                        this.$router.push({name: 'user-list'});
                    });
            }
        }
    }
</script>