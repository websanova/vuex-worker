export default {
    namespaced: true,

    state() {
        return {
            data: {},

            previous: {},

            timer: null
        };
    },
    
    mutations: {
        data(state, data) {
            state.data = data;
        },

        previous(state, fields) {
            state.previous = JSON.parse(JSON.stringify(fields));
        },

        update(state, data) {
            var i;

            for (i in data) {
                this._vm.$set(state.data, i, data[i]);
            }
        }
    },

    actions: {
        reset(ctx, filters) {
            var i,
                j, jj,
                options,
                labelKey,
                valueKey,
                filterOptions,
                ddefault,
                data = {};

            for (i in filters) {
                options = [];
                labelKey = (filters[i].options || {}).labelKey || 'label';
                valueKey = (filters[i].options || {}).valueKey || 'value';
                filterOptions = (filters[i].options || {}).list || filters[i].options;

                if (filterOptions) {
                    for (j = 0, jj = filterOptions.length; j < jj; j++) {
                        options.push({
                            label: (filterOptions[j][labelKey] !== undefined ? filterOptions[j][labelKey] : filterOptions[j]),
                            value: (filterOptions[j][valueKey] !== undefined ? filterOptions[j][valueKey] : filterOptions[j]),
                        });
                    }
                }
                
                ddefault = filters[i].default !== undefined ? filters[i].default : filters[i];

                data[i] = {
                    as: filters[i].as || i,
                    default: ddefault,
                    value: filters[i].value !== undefined ? filters[i].value : ddefault,
                    show: filters[i].show,
                    reset: filters[i].reset || [],
                    options: options.length ? options : null,
                };

                if (data[i].reset.constructor !== Array) {
                    data[i].reset = [data[i].reset];
                }

                if (i !== 'page' && !data[i].reset.length) {
                    data[i].reset = ['page'];
                }
            }

            ctx.commit('data', data);

            ctx.commit('previous', ctx.getters['fields']);
        },

        update(ctx, filters) {
            var i,
                j, jj,
                reset = null,
                timer = null,
                data = JSON.parse(JSON.stringify(ctx.state.data));

            for (i in filters) {
                if (data[i]) {
                    data[i].value = filters[i] === undefined ? data[i].default : filters[i];
                }

                for (j = 0, jj = data[i].reset.length; j < jj; j++) {

                    if (!filters[data[i].reset[j]]) {
                        data[data[i].reset[j]].value = data[data[i].reset[j]].default;
                    }
                }
            }

            ctx.commit('previous', ctx.getters['fields']);
            
            ctx.commit('update', data);
        }
    },

    getters: {
        data(state) {
            return state.data;
        },

        fields(state) {
            var i,
                fields = {};

            for (i in state.data) {
                fields[i] = state.data[i].value
            }

            return fields;
        },

        query(state) {
            var i,
                query = {};

            for (i in state.data) {
                query[i] = undefined;
                
                if (
                    state.data[i].show !== false &&
                    state.data[i].default !== state.data[i].value
                ) {
                    query[i] = state.data[i].value;
                }
            }

            return query;
        },

        isChange(state, getters) {
            return JSON.stringify(state.previous) !== JSON.stringify(getters.fields);
        }
    }
}