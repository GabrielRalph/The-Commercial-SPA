<template>
  <v-window v-model = "window_location" :touchless = "true">
    <v-window-item>
      <options></options>
    </v-window-item>
    <v-window-item>
      <program></program>
    </v-window-item>
  </v-window>
</template>

<script>
/* eslint no-console: ["error", { allow: ["log", "error"] }] */

import {bus} from '../../databus.js'
import Options from './Options.vue'
import Program from './Program.vue'

export default {
  components: {
    Options,
    Program
  },
  data(){
    return {
      window_location: 0,
    }
  },
  created(){
    bus.$on('program', () => {
      this.window_location = 1;
    })
  }
}
</script>
