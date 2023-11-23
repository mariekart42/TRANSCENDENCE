<!-- App.vue -->
<template>
  <div id="app">
    <my-component></my-component>
  </div>
</template>

<script>
import LoginRegister from "@/components/LoginRegister.vue";

export default {
  components: {
    'my-component': LoginRegister,
  },
};

</script>


<style>
/* Your styles go here */
</style>
