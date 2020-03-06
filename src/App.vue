<template>
  <div class = "full-page">
    <v-window v-model = "page" :touchless = "true">
      <v-window-item>
        <shop></shop>
      </v-window-item>

      <v-window-item>
        <home></home>
      </v-window-item>

      <v-window-item>
        <artworks></artworks>
      </v-window-item>
    </v-window>
  </div>
</template>

<script>

/* eslint no-console: ["error", { allow: ["log", "error"] }] */

import {bus} from './databus.js'
import Home from './windows/home/Home.vue'
import Artworks from './windows/artworks/Artworks.vue'
import Shop from './windows/shop/Shop.vue'
export default {
  name: 'App',
  components: {
    Home,
    Artworks,
    Shop
  },
  data: () => ({
    page: 1,
  }),

  created(){
    bus.$on('shop', () => {
      this.page = 0;
    })
    bus.$on('artworks', () => {
      this.page = 2;
    })
    bus.$on('home', () => {
      this.page = 1;
    })
  }
};
</script>
<style>
</style>
