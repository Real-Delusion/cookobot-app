<template>
  <div class="vuertual-numeric-keyboard bg-light rounded border p-3">
    <button
      v-for="key in keys"
      :key="key"
      @click="press(key)"
      class="btn btn-lg is-primary"
    >{{ key }}</button>
    <button class="btn btn-lg is-danger" @click="clear()">X</button>
    <button class="btn btn-lg is-primary" @click="press(0)">0</button>
    <button class="btn btn-lg is-success" @click="clear('all')">OK</button>
  </div>
</template>

<script>

export default {
  props: ['selfValue'],
  data() {
    return {
      value: '',
      keys: [[1,2,3,4,5,6,7,8,9].keys()],
    };
  },
  methods: {
    press(key) {
      this.value = `${this.value}${key}`;
    },
    clear(type) {
      if (type === 'all') this.value = '';
      else this.value = this.value.substring(0, this.value.length - 1);
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
  },
};
</script>

<style scoped>
</style>