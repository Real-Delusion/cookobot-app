<template>
  <div
    class="robot-button"
    v-bind:id="id"
    v-bind:description="description"
    v-bind:selected="selected"
  >
    <div class="columns is-marginless">
      <div class="column robot-icon is-two-fifths" v-bind:style="{backgroundColor: bgcolor}">
        <span class="icon">
          <font-awesome-icon icon="robot" />
        </span>
      </div>
      <div
        class="column robot-text is-three-fifths"
        v-bind:style="[selected ? {'border-radius': robotTextRadiusSelected} : {'border-radius': robotTextRadiusUnselected}]"
      >
        <div>
          <b>#{{id}}</b>
        </div>
        <div>{{description}}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  mixins: [],
  props: ["id", "description", "bgcolor", "selected"],
  data() {
    return {
      robotTextRadiusUnselected: "0 0.5rem 0.5rem 0",
      robotTextRadiusSelected: "0"
    };
  },
  created: async function() {},
  methods: {
  }
};
</script>

<style scoped>
.robot-button {
  height: 100%;
  background: none;
  border: none;
  padding: 0;
  width: 30vh;
  border: 0.5rem solid transparent;
}
.robot-icon {
  background-color: var(--robot1);
  border-radius: 0.5rem 0 0 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 3rem;
  color: white;
}
.robot-text {
  background-color: white;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  font-size: 1.5rem;
  align-items: flex-start;
  text-transform: capitalize;
}
.icon {
  padding: 2.5rem;
}
.robot-text div {
  height: auto;
}
</style>
