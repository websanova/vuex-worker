<template>
    <div>
        <div
            v-if="status === 'loading'"
        >
            <span class="spinner">
                Loading...
            </span>
        </div>

        <template
            v-else-if="status === 'success' || status === 'loading-silent'"
        >
            <slot />
        </template>

        <div
            v-else-if="status === 'error'"
        >
            Error loading data.

            <div
                v-if="errorMsg"
                class="text-danger py-2"
            >
                {{ errorMsg }}
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            status: String,
            errorMsg: String,
        }
    }
</script>