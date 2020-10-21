<template>
    <el-layout
        title="Vuex Worker 2.x Demo"
        package="vue-upload"
        :links="[{
            to: {name: 'user-list'},
            text: 'List'
        }]"
    >
        <router-view />
    </el-layout>
</template>

<script>
    import demoStr  from '../store/modules/demo';
    import elLayout from '../elements/Layout.vue';

    export default {
        beforeCreate() {
            this.$store.addModule('demo', demoStr);
        },

        components: {
            elLayout,
        }
    }
</script>
