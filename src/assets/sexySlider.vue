<template>
  <div class = "slider-container" ref = "slider" v-on:touchmove = "preventScroll">
    <div class = "guidline"></div>
    <div class = "line" v-bind:style = "styleLine"></div>
    <div class = "point-slider" v-bind:style = "styleP1"></div>
    <div class = "clickbox" v-bind:style = "styleP1" v-on:touchmove = "moveP1" v-on:touchend = "quantiseP1"></div>
    <div class = "point-slider" v-bind:style = "styleP2" v-on:touchmove = "moveP2"></div>
    <div class = "clickbox" v-bind:style = "styleP2" v-on:touchmove = "moveP2" v-on:touchend = "quantiseP2"></div>
    <div class = "label-left">{{scale[0]}}</div><div class = "label-right">{{scale[1]}}</div>
  </div>
</template>

<script>
/* eslint no-console: ["error", { allow: ["log", "error"] }] */

export default {
  props: {
    scale:{
      type: Array,
      default(){return  ['S', 'L']}
    }
  },
  data(){
    return{
      width: 0,
      offset: 0,
      p1: 0,
      p2: 100,
      gap: 20
    }
  },
  methods:{
    reset(){
      this.p1 = 0;
      this.p2 = 100;
    },
    moveP1(e){
      this.width = this.$refs.slider.clientWidth;
      this.offset = this.$refs.slider.offsetLeft;
      var newp1 = 100*(e.touches[0].clientX - this.offset - 26.667)/this.width;
      this.p1 = (newp1 < this.p2 - this.gap)&&(newp1 > 0) ? newp1:this.p1;
    },
    moveP2(e){
      this.width = this.$refs.slider.clientWidth;
      this.offset = this.$refs.slider.offsetLeft;
      var newp2 = 100*(e.touches[0].clientX - this.offset - 26.667)/this.width;
      this.p2 = (newp2 > this.p1 + this.gap)&&(newp2 < 100) ? newp2:this.p2;
    },
    quantiseP1(){
      this.$emit('change', [this.p1, this.p2]);
      // this.p1 += this.p1%this.gap < this.gap/2 ? (-this.p1%this.gap):this.p1%this.gap
    },
    quantiseP2(){
      this.$emit('change', [this.p1, this.p2]);
      // this.p2 += this.p2%this.gap < this.gap/2 ? (-this.p2%this.gap):this.p2%this.gap
    },
    preventScroll(e){
      e.preventDefault();
    }
  },
  computed: {

    styleP1(){
      return {
        left: "calc((100% - 22px) * " + this.p1 + " / 100)"
      }
    },
    styleP2(){
      return {
        right: "calc((100% - 22px) * (100 - " + this.p2 + ") / 100)"
      }
    },
    styleLine(){
      return{
        left: "calc((100% - 22px) * " + this.p1 + " / 100)",
        width: this.width ? (this.width - 40)*(this.p2-this.p1)/100 + "px": "calc(100% - 40px)"
      }
    }
  },
  mounted(){
    if(!this.hidden){
      this.width = this.$refs.slider.clientWidth;
      this.offset = this.$refs.slider.offsetLeft;
    }
  }
}
</script>

<style scoped>

.slider-container{
  font-size: 15pt;
  font-weight: 400;
  height: 40px;
  position: relative;
}
.point-slider{
  border: solid black 4px;
  height: 22px;
  width: 22px;
  display: inline-block;
  position: absolute;
  border-radius: 14px;
  background: #FFFFFF;
}
.clickbox{
  height: 40px;
  width: 30px;
  display: inline-block;
  position: absolute;
}
.line{
  background: black;
  position: absolute;
  top: 0;
  margin: 9px 20px;
  height: 4px;
}
.guidline{
  background: #aaa;
  position: absolute;
  top: 0;
  width: calc(100% - 2*20px);
  margin: 9px 20px;
  height: 4px;
}
.label-left{

  display: inline-block;
  float: left;
  margin-top: 20pt;

}
.label-right{

  display: inline-block;
  float: right;
    margin-top: 20pt;
}
</style>
