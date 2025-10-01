<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style>
#app {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

body{
 background-color: rgb(245, 245, 245);
}

img,video{
  width: 100%;
}

html{
  overflow: hidden;
}
</style>
