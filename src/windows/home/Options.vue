<template>
  <div class = 'display-window'>

    <navigator icon = "40pt 2pt x" key = 'home'></navigator>

<!-- Artist -->
    <table>
      <tr @click = "dropdown('Artist')">
        <td>
          <h1>Artist</h1>
        </td>
        <td style = "width: 100%">
           <arrow size = "6pt 6pt" :direction = "isdown('Artist')?'up':'down'" float = 'right'></arrow>
        </td>
      </tr>
      <template  v-if = "isdown('Artist')">
        <tr v-for = "artist in names" :key = "artist.id">
          <td></td>
          <td @click = "filter({artists:artist.id, name: artist.first_name+' '+artist.last_name})">
            <h2>{{artist.first_name}} {{artist.last_name}}</h2>
          </td>
        </tr>
      </template>
    </table>

<!-- Type -->
    <table>
      <tr @click = "dropdown('Type')">
        <td>
          <h1>Type</h1>
        </td>
        <td style = "width: 100%">
           <arrow size = "6pt 6pt" :direction = "isdown('Type')?'up':'down'" float = 'right'></arrow>
        </td>
      </tr>
      <template  v-if = "isdown('Type')">
        <tr v-for = "type in types" :key = "type.id">
          <td></td>
          <td @click = "filter({types:type.id})">
            <h2>{{type.description}}</h2>
          </td>
        </tr>
      </template>
    </table>

<!-- Scale -->
    <table>
      <tr @click = "dropdown('Scale')">
        <td>
          <h1>Scale</h1>
        </td>
        <td style = "width: 100%">
           <arrow size = "6pt 6pt" :direction = "isdown('Scale')?'up':'down'" float = 'right'></arrow>
        </td>
      </tr>
      <tr v-if = "isdown('Scale')">
        <td @click = "filter({scale: scale})" style = "padding-left: 10pt;"><arrow size = "25pt 2pt" direction = 'right'></arrow></td>
        <td style = "padding-top: 22.5pt">
          <slider @change = "setRange($event, 'scale')"></slider>
        </td>
      </tr>
    </table>

<!-- Price -->
    <table>
      <tr @click = "dropdown('Price')">
        <td>
          <h1>Price</h1>
        </td>
        <td style = "width: 100%">
           <arrow size = "6pt 6pt" :direction = "isdown('Price')?'up':'down'" float = 'right'></arrow>
        </td>
      </tr>
      <tr v-if = "isdown('Price')">
        <td @click = "filter({price: price})" style = "padding-left: 10pt;">
          <arrow size = "25pt 2pt" direction = 'right'></arrow>
        </td>
        <td style = "padding-top: 22.5pt">
          <slider :scale = "['$', '$$$$$']" @change = "setRange($event, 'price')"></slider>
        </td>
      </tr>
    </table>



<!-- Store -->
    <table style = "margin-top: 40pt">
      <tr @click = "shop()">
        <td>
          <h1>Store</h1>
        </td>
        <td style = "width: 100%">
           <arrow size = "6pt 6pt" direction = "left" float = 'right'></arrow>
        </td>
      </tr>
    </table>

<!-- News -->
    <table>
      <tr @click = "dropdown('News')">
        <td>
          <h1>News</h1>
        </td>
        <td style = "width: 100%">
           <arrow size = "6pt 6pt" :direction = "isdown('News')?'up':'down'" float = 'right'></arrow>
        </td>
      </tr>
      <template  v-if = "isdown('News')">
        <tr v-for = "(newsitem, key) in news" :key = "'news-' + key">
          <td></td>
          <td>
            <h3>{{date(newsitem.news_date)}}</h3>
            <p class = "list_p">{{newsitem.title}}</p>
          </td>
        </tr>
      </template>
    </table>

<!-- Program -->
    <table>
      <tr @click = "dropdown('Program')">
        <td>
          <h1>Program</h1>
        </td>
        <td style = "width: 100%">
           <arrow size = "6pt 6pt" :direction = "isdown('Program')?'up':'down'" float = 'right'></arrow>
        </td>
      </tr>
      <template  v-if = "isdown('Program')">
        <tr v-for = "programitem in programs" :key = "programitem.id">
          <td></td>
          <td @click = "program()">
            <h2>{{programitem}}</h2>
          </td>
        </tr>
      </template>
    </table>

<!-- Footer -->
    <table>
      <tr>
        <td><h3 style = "text-align: left">FACEBOOK</h3></td>
        <td><h3 style = "text-align: center">TWITTER</h3></td>
        <td><h3 style = "text-align: right">INSTAGRAM</h3></td>
      </tr>
    </table>

  </div>
</template>

<script>
/* eslint no-console: ["error", { allow: ["log", "error"] }] */

import {bus} from '../../databus.js'
export default {
  data(){
    return{
      dd: 'null',
      price: [0, 10],
      scale: [0, 10],
      names: [],
      types: [],
      news: [],
      programs: [],
    }
  },
  methods: {
    date(utcSeconds){
      var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
      d.setUTCSeconds(utcSeconds);
      return d.getDate() +'/'+ d.getMonth() +'/'+ d.getFullYear()
    },
    setRange(e, what){
      console.log(e)
      this[what] = [e[0] + 1, e[1] + 1];
    },
    dropdown(x){
      if(this.dd.indexOf(x) == -1){
        this.dd = 'null' + x; // To have multiply things open change line to this.dd += x
      }else{
        var dd_split = this.dd.split(x);
        if(dd_split[1]){
          this.dd = dd_split[0] + dd_split[1];
        }else{
          this.dd = dd_split[0];
        }
      }
    },
    isdown(x){
      return (this.dd.indexOf(x) != -1)
    },
    filter(filter){
      var dhl = filter?filter:0;
      localStorage.filter = JSON.stringify(dhl);
      localStorage.page = 'artworks'
      bus.$emit('artworks', dhl);
    },
    program(){
      bus.$emit('program')
    },
    shop(){
      bus.$emit('shop')
    }
  },
  created(){
    bus.$on('home', () => {
      this.dd = []
    })
    bus.query('get_names', (names) => {
      this.names = names.sort((a,b)=>{ return a.last_name < b.last_name?-1:(a.last_name > b.last_name?1:0)})
    });
    bus.query('get_types', (types) => {
      this.types = types.sort((a,b)=>{ return a.description < b.description?-1:(a.description > b.description?1:0)})
    });
    bus.query('get_news', (news) => {
      this.news = news;
    });
  }
}
</script>
<style>
.list_p{
  padding-bottom: 20px;
  font-size: 16px;
  font-style: italic;
}
</style>
