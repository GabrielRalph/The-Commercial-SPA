<template>
  <div class = 'display-window'>
    <div @click = "back">
      <arrow key = "artview" direction = "down" size = "70px 3.5px" float = "right"></arrow>
    </div>
  </div>
</template>

<script>
/* eslint no-console: ["error", { allow: ["log", "error"] }] */
import {bus} from '../../databus.js'

export default {
  methods: {
    back(){
      bus.$emit('home')
    }
  }
}
</script>
