<!-- Navigator is a component that will sit at the top of ever window
and will enable the user to navigate from one window to an other.
The component has two properties that can be set:

Location: an array that points to the window coordinates of a choosen
          window, when the navigator is clicked it will emit an
          event to the databus to navigate to this window

          default: [2, 2]       (home window)

icon: a string of properties to set the navigation icon

      format: size line_thickness direction/mode float(optional)

      default: 40pt 2pt 2lines right-->


<template>
  <!-- Navigator -->
  <div class = 'navigator' @click = "navigate(location)">
    <div style = "width: 100%; height: 40pt">
      <arrow :mode = 'mode' :size = 'size' :float = 'float' :direction = 'direction'></arrow>
    </div>
    <div v-if = "logo" class = 'logo'>
      THE COMMERCIAL
    </div>
  </div>
</template>

<script>
import {bus} from '../databus.js'

export default {
  data(){
    return{
      mode: 'arrow',
      size: '',
      float: 'right',
      direction: '',
    }
  },
  props:{
    location: {
      type: Array,
      default(){
        return [1,1]
      }
    },
    icon: {
      type: String,
      default: '40pt 2pt 2lines right'
    },
    logo: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    navigate(pos){
      bus.$emit('navigate', pos, '', '')
    }
  },
  created(){
    var directions = 'up down right left'
    var par = this.icon.split(' ');
    this.size = par[0] + ' ' + par[1];
    this.direction = directions.indexOf(par[2])!=-1?par[2]:'';
    this.mode = directions.indexOf(par[2])==-1?par[2]:'arrow';
    if(par[3]){
      this.float = par[3];
    }
  }
}
</script>

<style scoped>
  .navigator{
    margin: 30pt 0;
  }
  .logo{
    font-family: 'Abril Fatface', cursive;
    letter-spacing: 2pt;
    width: 200%;
    font-size: 45pt;
    text-align: center;
    transform: scaleX(0.5) translateX(-50%);
  }
</style>
