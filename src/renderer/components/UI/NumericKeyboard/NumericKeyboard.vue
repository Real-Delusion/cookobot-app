<template>
  <div class="keyboard-container">
    <div v-for="key in keys" :key="key" class="columns">
      <div class="column is-one-third">
        <button @click="press(key)" class="button is-medium is-primary is">{{ key }}</button>
      </div>
      <div class="column is-one-third">
        <button @click="press(key+1)" class="button is-medium is-primary">{{ key + 1}}</button>
      </div>
      <div class="column is-one-third">
        <button @click="press(key+2)" class="button is-medium is-primary">{{ key + 2}}</button>
      </div>
    </div>
    <div class="columns">
      <div class="column is-one-third">
        <button class="button is-medium is-danger" @click="clear()">
          <span class="icon">
            <font-awesome-icon icon="backspace" />
          </span>
        </button>
      </div>
      <div class="column is-one-third">
        <button class="button is-medium is-primary" @click="press(0)">0</button>
      </div>
      <div class="column is-one-third">
        <button class="button is-medium is-success" @click="login()">
          <span class="icon">
            <font-awesome-icon icon="sign-in-alt" />
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["selfValue"],
  data() {
    return {
      value: "",
      keys: [...Array(9).keys()]
    };
  },
  methods: {
    press(key) {
      if (this.value.length < 4) {
        this.value = `${this.value}${key}`;
        //console.log(this.value);
      }
    },
    clear(type) {
      if (type === "all") this.value = "";
      else this.value = this.value.substring(0, this.value.length - 1);
    },
    login() {
      this.$parent.login();
    }
  },
  watch: {
    value() {
      this.$emit("pressed", this.value);
    },
    selfValue() {
      this.value = this.selfValue;
    }
  },
  created() {
    this.keys = [1, 4, 7];
  }
};
</script>

<style scoped>
button {
  width: 100%;
  height: 100%;
  min-height: 3rem;
  font-size: 4rem !important;
}
.keyboard-container {
  width: 100%;
  height: 100%;
}
.columns {
  height: 25%;
}
</style>