<template>
  <div class = "full-page">
    <v-window v-model = "page" :touchless = "true">
      <v-window-item>
        <div class = "th">
          1
        </div>
      </v-window-item>

      <v-window-item>
        <home-window></home-window>
      </v-window-item>

      <v-window-item>
        <list-window></list-window>
      </v-window-item>
    </v-window>
  </div>
</template>

<script>

/* eslint no-console: ["error", { allow: ["log", "error"] }] */

import {bus} from './databus.js'
import HomeWindow from './windows/Home.vue'
import ListWindow from './windows/List.vue'
export default {
  name: 'App',
  components: {
    HomeWindow,
    ListWindow
  },
  data: () => ({
    page: 1,
  }),
  created(){
    bus.$on('navigate', (pos) => {
      this.page = pos[0]
    })
  }
};
</script>
<style>
</style>
