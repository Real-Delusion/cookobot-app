<template>
  <div class="modal {{active}}">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Configure Polly</p>
        <button class="delete" aria-label="close"></button>
      </header>
      <section class="modal-card-body">
        <!-- Content ... -->
        <input class="input" type="text" placeholder="Put something">
        <button @click="generarAudio()" class="button is-medium is-primary">Generar Audio</button>

      </section>
      <footer class="modal-card-foot">
        <button class="button is-success">Save changes</button>
        <button class="button">Cancel</button>
      </footer>
    </div>
  </div>
</template>

<script>


  export default {
    mixins: [Polly],
    props: ["active"],
    data() {
      return {
        textos: [
          "Hola, está disfrutando de su comida",
          "Muchas gracias, hasta pronto"
        ],
        disabled: true
      };
    },
    created: async function () {
    },
    methods: {
      generateAudio: async function (nombreArchivo, texto) {
        try{
          this.runPollyAction(nombreArchivo, texto, 1)
          control = this.awaitPolly()
          this.disabled = false
          if(control){ this.disabled = true}
        }
        catch (error) {
          console.log(error);
        }
      },
      playAudio: async function (nombreArchivo) {
        try{
          this.runPollyAction(nombreArchivo, '', 2)
          control = this.awaitPolly()
          this.disabled = false
          if(control){ this.disabled = true}
        }
        catch (error) {
          console.log(error);
        }
      },
      deleteAudio: async function (nombreArchivo) {
        try{
          this.runPollyAction(nombreArchivo, '', 3)
          control = this.awaitPolly()
          this.disabled = false
          if(control){ this.disabled = true}
        }
        catch (error) {
          console.log(error);
        }
      }
    }
  };
</script>

<style scoped>
</style>