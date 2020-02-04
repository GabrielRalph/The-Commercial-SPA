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
          <td @click = "navigate([2,1], {artists:artist.id, name: artist.first_name+' '+artist.last_name})">
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
          <td @click = "navigate([2,1], {types:type.id})">
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
        <td @click = "navigate([2,1], {scale: scale})" style = "padding-left: 10pt;"><arrow size = "25pt 2pt" direction = 'right'></arrow></td>
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
        <td @click = "navigate([2,1], {price: price})" style = "padding-left: 10pt;">
          <arrow size = "25pt 2pt" direction = 'right'></arrow>
        </td>
        <td style = "padding-top: 22.5pt">
          <slider :scale = "['$', '$$$$$']" @change = "setRange($event, 'price')"></slider>
        </td>
      </tr>
    </table>



<!-- Store -->
    <table style = "margin-top: 40pt">
      <tr @click = "navigate([0,1])">
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
      <!-- <template  v-if = "isdown('News')">
        <tr v-for = "newsitem, key in news" :key = "'news-' + key">
          <td></td>
          <td>
            <h2>{{newsitem}}</h2>
          </td>
        </tr>
      </template> -->
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
          <td @click = "navigate([1,0])">
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

import {bus} from '../databus.js'
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

    setRange(e, what){
      console.log(e)
      this[what] = [Math.round(e[0]/10), Math.round(e[1]/10)];
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
    navigate(pos, filter){
      console.log('move')
      var dhl = filter?filter:0;
      bus.$emit('navigate', pos, dhl, 'filter');
    }
  },
  created(){
    bus.query('get_names', (names) => {
      this.names = names.sort((a,b)=>{ return a.last_name < b.last_name?-1:(a.last_name > b.last_name?1:0)})
    });
    bus.query('get_types', (types) => {
      this.types = types.sort((a,b)=>{ return a.description < b.description?-1:(a.description > b.description?1:0)})
    });

    bus.$on('navigate', (pos, dhl, name) => {
      if(name == ''){
        this.dd = 'null';
      }
    })
  }
}
</script>
