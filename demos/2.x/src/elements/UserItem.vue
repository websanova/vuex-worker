<template>
    <div
        class="media"
    >
        <div class="media-tight">
            <img :src="avatar || '//www.gravatar.com/avatar/?d=identicon&s=200'" width="25" />
        </div>

        <div class="media-middle px-2">
            {{ id }} : {{ first_name }} {{ last_name }}
        </div>

        <div class="media-tight media-middle">
            <ul class="spacer spacer-pipe text-sm">
                <li
                    v-if="is_active"
                >
                    <span
                        class="text-link"
                        @click="$emit('view')"
                    >
                        show
                    </span>
                </li>

                <li
                    v-if="is_active"
                >
                    <span
                        class="text-link"
                        @click="$emit('update')"
                    >
                        update
                    </span>
                </li>

                <li
                    v-if="!is_active"
                >
                    <span
                        class="text-link"
                        @click="$emit('undelete')"
                    >
                        undelete
                    </span>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            id: Number,
            avatar: String,
            first_name: String,
            last_name: String,
            is_active: Boolean,
        }
    }
</script>