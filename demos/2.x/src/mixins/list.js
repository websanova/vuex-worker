export default function (options) {
    options = options || {};

    return {
        mounted() {
            var query = this._payload.list.filter.query;

            if (this._payload.list.form.status === null) {
                this._worker
                    .list
                    .work('filter/update', {
                        page: this.$route.query.page,
                        role: this.$route.query.role,
                        state: this.$route.query.state,
                        query: this.$route.query.query,
                    })
                    .request();
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

            if (options.clearOnDestroy) {
                this._worker.list.work('clear');
            }
        },

        methods: {
            filter(data) {
                this._worker
                    .list
                    .work('filter/update', data)
                    .then(() => {
                        if (this._payload.list.filter.isChange) {
                            this._worker.list.request();
                        }
                    });
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
    };
}