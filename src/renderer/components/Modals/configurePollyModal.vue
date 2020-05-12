<template>
  <div class="modal">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Configure Polly</p>
        <button class="delete" aria-label="close"></button>
      </header>
      <section class="modal-card-body">
        <!-- Content ... -->
        <button @click="generarAudio()" class="button is-medium is-primary">{{ key + 1}}</button>

      </section>
      <footer class="modal-card-foot">
        <button class="button is-success">Save changes</button>
        <button class="button">Cancel</button>
      </footer>
    </div>
  </div>
</template>

<script>
  // import bus for events
  import { bus } from "../../main";


  export default {
    mixins: [Polly],
    props: ["table", 'selected'],
    data() {
      return {
      };
    },
    created: async function () {
    },
    methods: {
      generarAudio: function (table) {

      },
      borrarAudio: function (table) {
      },
      borrarAudio: function (table) {
      }
    }
  };
</script>

<style scoped>
</style>