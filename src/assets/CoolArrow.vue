<template>
  <div :style = "boxStyle">
    <div :style="arrowStyle" v-if = "mode == 'arrow'">
    </div>
    <div v-if = "mode == '2lines'" :style = "lineStyle">
    </div>

    <div v-if = "mode == 'x'" style = "transform: rotateZ(-45deg)"  :style = "xStyle">
    </div>
    <div v-if = "mode == 'x'" style = "transform: rotateZ(45deg)" :style = "xStyle">
    </div>

  </div>
</template>

<script>

export default {
  props: {
    direction: {
      type: String,
      default: 'left'
    },
    size: {
      type: String,
      default: '10pt 5pt'
    },
    colour: {
      type: String,
      default: 'black'
    },
    mode: {
      type: String,
      default: 'arrow'
    },
    float: {
      type: String,
      default: 'left'
    }
  },
  computed: {
    arrowStyle(){
      var th = this.size.split(' ')[1];
      var x = this.size.split(' ')[0];
      var thf = (parseFloat(x))*0.70710678/2 + 0.2;
      if(parseFloat(th) > thf){
        th = thf + x.split(parseFloat(x))[1];
      }
      var angle = {left: '45deg', right: '-135deg', up: '135deg', down: '-45deg'};
      var move = {left: 'translateX(35.355339%)', right: 'translateX(-35.355339%)', up: 'translateY(35.355339%)', down: 'translateY(-35.355339%)'};
      return{
        'margin': '14.64466%',
        'width': 'calc(70.710678% - 2*' + th +')',
        'height': 'calc(70.710678% - 2*' + th +')',
        'border-left': th + ' solid ' + this.colour,
        'border-bottom': th + ' solid ' + this.colour,
        'border-top': th + ' solid transparent',
        'border-right': th + ' solid transparent',
        'transform': move[this.direction] + ' rotateZ('+angle[this.direction]+')',
      }
    },
    lineStyle(){
      var th = this.size.split(' ')[1];
      var x = this.size.split(' ')[0];
      var thf = (parseFloat(x))*0.5;
      if(parseFloat(th) > thf){
        th = thf + x.split(parseFloat(x))[1];
      }
      return{
        'width': '100%',
        'height': 'calc((100% - 2*' + th +')/3)',
        'margin': 'calc((100% - 2*' + th +')/3) 0',
        'border-bottom': th + ' solid ' + this.colour,
        'border-top': th + ' solid ' + this.colour,
      }
    },
    xStyle(){
      var th = this.size.split(' ')[1];
      var x = this.size.split(' ')[0];
      var thf = (parseFloat(x))*0.5;
      if(parseFloat(th) > thf){
        th = thf + x.split(parseFloat(x))[1];
      }
      return{
        'width': '100%',
        'height': th,
        'top': '0',
        'left': '0',
        'margin': 'calc((100% - ' + th +')/2) 0',
        'background': this.colour,
        'position': 'absolute'
      }
    },
    boxStyle(){
      var x = this.size.split(' ')[0];
      return{
        'width': x,
        'height': x,
        'float': this.float,
        'position': 'relative'
      }
    }
  }
}
</script>
<style>

</style>
