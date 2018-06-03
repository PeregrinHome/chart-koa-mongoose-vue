<template>
    <div>
        <router-view></router-view>
    </div>
</template>

<script>


    export default {
        name: 'app',
        data: () => {
            return {
                drawer: true
            };
        },
        components: {

        }
    }
</script>

<style>

</style>
