<template>
    <div>
        <div class="media">
            <div>
                <ul class="spacer">
                    <li>
                        <button
                            @click="$emit('refresh')"
                        >
                            Refresh
                        </button>
                    </li>

                    <li>
                        <button
                            @click="$emit('silent')"
                        >
                            Silent
                        </button>
                    </li>

                    <li>
                        <span
                            v-show="_isLoading || _isLoadingSilent"
                            class="spinner"
                        />
                    </li>
                </ul>
            </div>

            <div class="media-tight">
                <ul class="spacer">
                    <li
                        v-for="(filter, key) in filters"
                        v-if="filter.options"
                        :key="key"
                    >
                        <select
                            :value="filter.value"
                            @change="emitFilter(key, $event.target.value)"
                        >
                            <option
                                v-for="option in filter.options"
                                :value="option.value"
                            >
                                {{ option.label }}
                            </option>
                        </select>
                    </li>
                </ul>
            </div>
        </div>

        <hr/>

        <div
            v-if="_isLoading && !_isLoadingSilent"
        >
            <span class="spinner">
                Loading...
            </span>
        </div>

        <div
            v-else
        >
            <template
                v-for="(item,index) in _items"
            >
                <slot
                    name="item"
                    :item="item"
                    :index="index"
                />
            </template>

            <div
                v-if="!_items.length"
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
                v-bind:class="[i === currentPage ? 'active' : '']"
                @click="emitFilter('page', i)"
            >
                {{ i }}
            </span>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            items: Array,
            total: Number,
            perPage: Number,
            currentPage: Number,
            status: String,
            filters: Object,
        },

        computed: {
            _items() {
                return this.items || [];
            },

            _pages() {
                if (this.total && this.perPage) {
                    return Math.ceil(this.total / this.perPage);
                }

                return 0;
            },

            _isLoading() {
                return this.status === 'loading';
            },

            _isLoadingSilent() {
                return this.status === 'loading-silent';
            }
        },

        mounted() {
            this.reset();
        },

        methods: {
            reset() {
                this.setWatches();
            },

            setWatches() {
                var i;

                if (this.filters) {
                    for (i in this.filters) {
                        ((i) => {
                            this.$watch('$route.query.' + i, (val) => {
                                this.emitFilter(i, val);
                            });
                        })(i);
                    }
                }
            },

            emitFilter(key, val) {
                var data = {};

                data[key] = val;

                this.$emit('filter', data);
            }
        }
    }
</script>