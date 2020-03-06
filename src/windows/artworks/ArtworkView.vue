<template>
  <div class = "display-window margin-top">
    <div @click = "back" style = "width:100%; height: 70px">
      <arrow key = "artview" direction = "down" size = "70px 3.5px" float = "right"></arrow>
    </div>
    <template v-if = "get_artwork">
      <h1>{{get_artwork[0].title}}</h1>
      <h2 style = "padding-bottom: 50px">{{get_artwork[0].first_name}} {{get_artwork[0].last_name}}</h2>
      <v-window :show-arrows = "false" v-model = "delem">
        <v-window-item v-for="(artwork,i) in get_artwork" :key="i+'image-artview'">
          <v-img v-if = "artwork.image_url" :src = "artwork.image_url" :lazy-src = "artwork.thumb_url" :height = "max_image_height" contain></v-img>
        </v-window-item>
      </v-window>
      <table>
        <tr>
          <td style = "width: 50%">

          </td>
          <td v-for = "(artwork, i) in get_artwork" :key = "'delem'+i">
            {{i == delem?'x':'o'}}
          </td>
          <td style = "width: 50%">

          </td>
        </tr>
      </table>
      <h5>
        {{get_artwork[delem].img_caption}}
      </h5>
      <h5>{{get_artwork[0].medium_descriptive}}</h5>
      <h5>{{get_artwork[0].collection_caption}}</h5>
      <h5>{{get_artwork[0].edition_caption}}</h5>
      <h5 v-html = "get_artwork[0].description"></h5>
      <h5>{{dimensions}}</h5>
      <div style = "height: 100px">

      </div>
    </template>
  </div>
</template>

<script>

/* eslint no-console: ["error", { allow: ["log", "error"] }] */
import {bus} from '../../databus.js'


export default {
  data(){
    return {
      artworks: [],
      price: 0,
      delem: 0,
    }
  },
  computed: {
    get_artwork(){
      if( this.artworks.length > 0){
        return this.artworks
      }else {
        return false
      }
    },
    dimensions(){
      var dim = '';
      var h = this.artworks[0].height;
      h = h?(h+'cm x '):''
      var w = this.artworks[0].width;
      w = w?(w+'cm'):''
      var d = this.artworks[0].depth;
      d = d?(' x '+d+'cm'):''
      dim = this.artworks[0].non_standard_dimensions;
      dim = dim?dim:(h+w+d);
      return dim
    },
    max_image_height(){
      var ratio = 0;
      for(var i in this.artworks){
        var new_ratio = this.artworks[i].img_height/this.artworks[i].img_width
        ratio = ratio<new_ratio?new_ratio:ratio;
      }
      return ratio*95+'vw'
    }
  },
  methods: {
    back(){
      bus.$emit('backtolist')
    },
    getData(id){
      bus.query('get_artwork/'+id, (artworks) => {
        this.artworks = artworks
      });
      console.log(id);
      // Get information on artwork, this may include name title year other pics about artist
    }
  },

  created(){
    if(localStorage.page == "artview"){
      this.price = localStorage.id_price_tile;
      this.getData(localStorage.id);
    }
    bus.$on('artview', (id, price) => {
      this.price = price;
      this.getData(id)
    })
  }
}
</script>

<style>
.margin-top{
  margin-top: 20px;
}
.constrain{
  background-size: 500px;
}
</style>
