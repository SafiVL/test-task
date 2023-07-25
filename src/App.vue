<template>
  <main-header/>
  <nav>
    <breadcrumb-nav/>
  </nav>
  <main>
    <project-data/>
  </main>
</template>

<script>
import ProjectData from './components/ProjectData.vue'
import MainHeader from './components/MainHeader'
import BreadcrumbNav from './components/BreadcrumbNav'

export default {
  name: 'App',
  components: {
    MainHeader,
    ProjectData,
    BreadcrumbNav
  }
}
</script>

<style>
@import "./css/style.css";
</style>
