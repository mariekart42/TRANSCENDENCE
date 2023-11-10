<!-- App.vue -->
<template>
  <div id="app">
    <my-component></my-component>
  </div>
</template>

<script>
import MyComponent from './components/MyComponent.vue';

export default {
  components: {
    'my-component': MyComponent,
  },
};
</script>

<style>
/* Your styles go here */
</style>
