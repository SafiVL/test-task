<template>
  <header></header>
  <nav>
<!--    <breadcrumb-nav/>-->
  </nav>
  <main>
    <project-data/>
  </main>
</template>

<script>
import ProjectData from './components/ProjectData.vue'

export default {
  name: 'App',
  components: {
    ProjectData
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
