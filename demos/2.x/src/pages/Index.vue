<template>
    <div class="container">
        <h1 class="header text-center">
            <a href="https://websanova.com">
                <img src="/img/logo-dark-text.png" />
            </a>
        </h1>

        <h1 class="text-center">
            Vuex Worker Demo
        </h1>

        <hr/>
        
        <ul class="text-center text-bold spacer spacer-pipe">
            <li><a href="https://websanova.com/docs/vuex-worker">Docs</a></li>
            <li><a href="https://github.com/websanova/vuex-worker">GitHub</a></li>
            <li><a href="https://patreon.com/websanova">Patreon</a></li>
        </ul>
        
        <hr/>

        <div class="text-center">
            <router-link :to="{name: 'user-list'}">Home</router-link>
        </div>

        <hr/>

        <div>
            <router-view />
        </div>
    </div>
</template>

<script>
    export default {

    }
</script>

<style lang="scss">
    @import '../styles/nova.css';
</style>