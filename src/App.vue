<template>
  <div class="main">
    <router-view></router-view>
    <div v-if="store.state.loading" class="loading">
      <div class="spinner-border" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>
  </div>
</template>
<script>
import store from "./store.js";

export default {
  name: "App",
  data() {
    return { store: store };
  },
  components: {},
  methods: {},
  created() {
    store.init();
  },
};
</script>

<style>
@import "assets/body.css";
</style>