import list from '@websanova/vuex-worker/src/actions/list';

export default {
    namespaced: true,

    modules: {
        worker: list
    },

    hooks: {
        created(ctx) {
            // this.worker('user/project/list').form.send();
        }
    },

    request: {
        url() {
            var user = this.getters['auth/user'];

            return 'demo/users/' + user.id +  '/projects/all';
        }
    }

    actions: {
        send(ctx) {
            console.log('send');

            console.log(ctx.getters['worker/stage/data']);

            return ctx.dispatch('worker/send', {
                url: 'demos/users/list'
            });
        },

        stage(ctx, data) {
            ctx.dispatch('worker/stage/update', data);
        },

        test() {
            return new Promise((res, rej) => {

                console.log('test');

                setTimeout(() => {

                    var rand = Math.round(Math.random());

                    if (rand === 0) {
                        rej('nay :-(');
                    }
                    else {
                        res('yay :-)')
                    }

                }, 1000);
            });
        }
    }
}