import Vue from 'vue'


/* eslint no-console: ["error", { allow: ["log", "error"] }] */


export const bus = new Vue({
  data: function(){
    return {
      requesting: false,
      buff: [],
      queryUrl: 'http://13.237.116.189/v2/query/',
    }
  },
  created: function(){
  },
  methods: {
    query: function(query, callback){

      console.log(query)

      // If we are currently requesting another query push this query
      // to the buffer
      if(this.requesting){
        this.buff.push({query, callback});

      // Otherwise run the query
      }else{
        this.requesting = true; //We are now requesting a query
        fetch(this.queryUrl+query).then((response, err) => {
          if (err) throw err
          return response.json()
        }).then((responseJson) => {

          if(responseJson.error){
            console.error('SQL ERROR: ' + responseJson.error)
          }else{
            callback(responseJson);
          }

          this.requesting = false; //We ar no longer requesting

          var lb = this.buff.pop(); //Recursivly run this function until buffer is empty
          if(lb){
            this.query(lb.query, lb.callback);
          }
        }).catch((err) => {
          console.error(err)

          this.requesting = false
          var lb = this.buff.pop(); //Recursivly run this function until buffer is empty
          if(lb){
            this.query(lb.query, lb.callback);
          }
        });
      }
    },
  },
})
