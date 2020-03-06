<template>
  <v-window v-model = "window_location" :touchless = "true" :vertical = "true">
    <v-window-item>
      <artwork-view :artwork = "artwork_item"></artwork-view>
    </v-window-item>
    <v-window-item>
      <artwork-list></artwork-list>
    </v-window-item>
  </v-window>
</template>

<script>

/* eslint no-console: ["error", { allow: ["log", "error"] }] */
import ArtworkList from './ArtworkList.vue'
import ArtworkView from './ArtworkView.vue'
import {bus} from '../../databus.js'

export default {
  name: 'App',
  components: {
    ArtworkView,
    ArtworkList
  },
  data(){
    return {
      window_location: 1,
      artworks_list: [],
      artwork_item: [],
      artworks_list_loaded: false,
      artwork_item_loaded: false,
      results: 0,
    }
  },
  created(){
    bus.$on('artview', () => {
      this.window_location = 0;
    })
    bus.$on('backtolist', () => {
      this.window_location = 1;
    })
  }
}
</script>

<style>

</style>
