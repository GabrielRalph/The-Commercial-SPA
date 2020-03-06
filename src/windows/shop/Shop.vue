<template>
  <v-window v-model = "window_location" :touchless = "true">
    <v-window-item>
      <shop-item-list></shop-item-list>
    </v-window-item>
    <v-window-item>
      <shop-item></shop-item>
    </v-window-item>
  </v-window>
</template>

<script>

/* eslint no-console: ["error", { allow: ["log", "error"] }] */
import ShopItem from './ShopItem.vue'
import ShopItemList from './ShopItemList.vue'

export default {
  components: {
    ShopItemList,
    ShopItem
  },
  data(){
    return {
      window_location: 0,
    }
  }

}
</script>

<style>

</style>
