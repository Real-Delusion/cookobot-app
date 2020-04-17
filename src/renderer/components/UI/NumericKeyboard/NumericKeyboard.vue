<template>
    <div class="column-gap">
        <div v-for="key in keys" :key="key" class="column is-full">
            <button @click="press(key)" class="button is-medium is-primary">{{ key }}</button>
            <button @click="press(key+1)" class="button is-medium is-primary">{{ key + 1}}</button>
            <button @click="press(key+2)" class="button is-medium is-primary">{{ key + 2}}</button>
        </div>
        <div class="column is-full">
            <button class="button is-medium is-danger" @click="clear('all')">X</button>
            <button class="button is-medium is-primary" @click="press(0)">0</button>
            <button class="button is-medium is-success" @click="login()">
                <span class="icon"><font-awesome-icon icon="signin" /></span>
            </button>
        </div>

    </div>
</template>

<script>
    export default {
        props: ['selfValue'],
        data() {
            return {
                value: '',
                keys: [...Array(9).keys()],
            };
        },
        methods: {
            press(key) {
                this.value = `${this.value}${key}`;
                console.log(this.value)
            },
            clear(type) {
                if (type === 'all') this.value = '';
                else this.value = this.value.substring(0, this.value.length - 1);
            },
            login() {

            },
        },
        watch: {
            value() {
                this.$emit('pressed', this.value);
            },
            selfValue() {
                this.value = this.selfValue;
            },
        },
        created() {
            this.keys = [1, 4, 7]
        },
    };
</script>

<style scoped>
</style>