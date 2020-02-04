<template>
  <div id = "page" v-scroll = "onScroll">
    <!-- Top button will appear when ever the user scrolls back up -->
    <div class = "top" :class = "{'hidden': top <= 0}" @click = "scrollTop">
      <h6>TOP</h6>
    </div>

    <!-- Navigator -->
    <navigator key = 'list'></navigator>
    <template v-if = "artworks.length">

      <!-- Header results -->
      <div>
        <h1 style="text-align: center; padding-bottom: 20pt; font-size: 24pt" v-if = "artist">{{artist}}</h1>
        <h1 style="text-align: center">{{results}} results</h1>
      </div>

      <!-- Sorter -->
      <div class = "sort-hidden" :class = "{'sort-expand':sortExpand}">
        <div class = "sort-options-box" v-if = "sortExpand">
          <h1 class = "sort-options-text" v-for = "(func, key) in sortMethods" @click = "sortExpand = !sortExpand; sortMethod = key" :key = "func">{{key}}</h1>
        </div>
        <div class = "sort-cancel-box" v-if = "sortExpand" @click = "sortExpand = false">
          <h1 class = "sort-options-text">Cancel</h1>
        </div>
      </div>
      <div class = "sort-header" @click = "sortExpand = !sortExpand">
        <h3 style="text-align: center; margin: 6pt 0">SORT</h3>
      </div>

      <!-- List -->
      <v-lazy v-for = "(artwork) in sortedArtworks" class = "display" @click = "navigate([2,0], artwork.id)" :key = "artwork.id">
        <v-card :flat = "true">
          <v-img v-if = "artwork.image_url" :src = "artwork.image_url" :lazy-src = "artwork.thumb_url" ></v-img>
          <v-img v-else src = "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSG8YmmaJFVPwxwNtVDK0ASJ1IUA7IXPjp0_iWsxG6uFVOZ4SSa"></v-img>
          <v-card-title>
            <table>
            <tr>

              <td>
                <h4>{{artwork.first_name}} {{artwork.last_name}}</h4>
              </td>
              <td>
                <h5 style = "text-align:right; font-size:10pt; float: right">{{artwork.year_from}}</h5>
              </td>
            </tr>
          </table>
          </v-card-title>

          <v-card-subtitle>
            <h5><i>{{artwork.title}}</i></h5>
          </v-card-subtitle>
        </v-card>
      </v-lazy>

      <!-- <artist-info v-if = "artist.length > 0" :id = "artworks[0].artist_id"></artist-info> -->
    </template>

    <!-- Footer -->
    <div v-if = "artworks.length == 0" class="loader">Loading...</div>
  </div>
</template>

<script>
import {bus} from '../databus.js'

/* eslint no-console: ["error", { allow: ["log", "error"] }] */

export default {

  data () {
    return {
      artworks: [],
      results: 0,
      artist: '',
      top: 0,
      sortExpand: false,
      sortMethods: {
        '$ - $$$$$': function(a, b){
          return a.price - b.price
        },
        '$$$$$ - $': function(a, b){
          return b.price - a.price
        },
        'new - old': function(a, b){
          return b.year_from - a.year_from
        },
        'old - new': function(a, b){
          return a.year_from - b.year_from
        }
      },
      sortMethod: '$ - $$$$$'
    }
  },

  methods:{
    scrollTop(){
      this.top = 0;
      this.$vuetify.goTo(0);
    },
    navigate(pos, dhl){
      bus.$emit('navigate', pos, dhl, 'artwork');
    },
    getList(filter){
      this.artist = '';
      var name = null;
      if(filter.price){
        name = 'get_artworks_by_price/'+filter.price+'/BETWEEN';
      }else if(filter.size){
        name = 'get_artworks_by_scale/'+filter.scale+'/BETWEEN';
      }else if(filter.artists){
        name = 'get_artworks_by_artists/'+filter.artists+'/IN';
      }else if(filter.types){
        name = 'get_artworks_by_types'+filter.types+'/IN';
      }
      bus.query(name, (artworks) => {
        this.artworks = artworks
        this.results = artworks.length;
        this.artist = filter.name?filter.name:''
      });
    },
    onScroll(e){
      if (typeof window === 'undefined') return
      const top = window.pageYOffset ||   e.target.scrollTop || 0;
      if(top > 2500){
        this.top = top;
        setTimeout(() => {
          if(this.top == top){
            this.top = 0;
          }
        }, 1500)
      }else{
        this.top = 0;
      }
    }
  },

  computed: {
    sortedArtworks() {
      var artworks = this.artworks.slice();
      var sorted = artworks.sort(this.sortMethods[this.sortMethod]);
      return sorted
    }
  },

  created(){
    if((localStorage.filter != 'undefined')&&(!!localStorage.filter)){
      var dhl = JSON.parse(localStorage.filter);
      this.getList(dhl)
    }
    bus.$on('navigate', (pos, dhl, name) => {
      this.scrollTop()
      this.loaded = 1
      if((name == 'filter')&&(pos[0] == 2)&&(pos[1] == 1)){
        this.artworks = []
        this.getList(dhl)
      }
    })
  }
}
</script>

<style scoped>
#page{
  margin: 0 20pt;
  overflow-y: scroll;
  overflow-x: hidden;
  height: 100%;

}
.sort-header{
  position: relative;
  border-bottom: 1.5pt solid black;
  margin: 20pt 0pt 5pt 0pt;
}

.sort-hidden{
  opacity: 0;
  color: transparent;
  width: 100%;
  height: 100%;
  position: absolute;
  pointer-events: none;
  top: 0;
  left: 0;
  margin: 0;
  z-index: 100;
  -webkit-backdrop-filter: blur(0px);
  backdrop-filter: blur(0px);
  background: transparent;
  transition: -webkit-backdrop-filter 0.5s, backdrop-filter 0.5s, background 0.5s, color 0.5s, opacity 0.5s cubic-bezier(0.5, 0.0, 0.5, 1.000);
}
.sort-expand{
  opacity: 1;
  color: black;
  pointer-events: all;
  -webkit-backdrop-filter: blur(5px);
  backdrop-filter: blur(5px);
  background: rgba(15,0,5,0.4);
}

.top{
  position: fixed;
  left: 50%;
  top: 10pt;
  z-index: 100;
  transform: translateX(-50%);
  padding: 5pt 40pt;
  background: white;
  border-radius: 25pt;
  box-shadow: 0pt 0pt 5pt rgba(0,0,0.1,0.1);
  transition: 0.5s;
}

.hidden{
  opacity: 0;
}
.top:not(.hidden){
  opacity: 0.7;
}
.sort-options-box{
  border-radius: 18pt;
  background: rgba(255, 255, 255, 0.8);
  position: absolute;
  bottom: calc(10pt + 50pt + 10pt/2);
  left: 10pt;
  width: calc(100% - 2*10pt);
}
.sort-cancel-box{
  border-radius: 18pt;
  background: rgba(255, 255, 255, 0.9);
  height: 50pt;
  position: absolute;
  bottom: 10pt;
  left: 10pt;
  width: calc(100% - 2*10pt);
}
.sort-options-text{
  padding: 9pt 0;
  text-align: center;
}
.v-card__title table{
  margin: 0;
}

</style>
