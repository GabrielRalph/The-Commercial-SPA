const express = require('express');
const app = express();
// const stripe = require('stripe')('sk_test_TjxMfQT2AWTxxvWFvTAAcpRI00o4FDVzae');
const fs = require('fs');
var mysql = require('mysql');

var thecommercialSQL = mysql.createConnection({
  host: "localhost",
  user: "node",
  password: "N0D3U5ER",
  database: "thecommercial"
});

var myquerys = require('./querys.json');


app.all('/', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next()
});

thecommercialSQL.connect(function(err) {
  // Handle errors
  if (err) {
    console.log(err)
  }else{

    app.get('/query/*', async (req, res, next) => {

      // Just hase to be done
      res.header("Access-Control-Allow-Origin", "*");
      var newQuery = ''
      var args = req.params[0].split('/')

      // gets query and replaces %PARAMS% with given paramters
      while(args.length > 0){
        var arg = args.shift()
        newQuery = !!myquerys[arg]?newQuery + myquerys[arg] + ' ':newQuery.replace(/%PARAMS%/, arg);
      }

      // Just check to see if enough params where given
      if(newQuery.indexOf('%PARAMS%') != -1){
        res.json({error: 'Not enough paramters'})
        next('Not enough paramters')
      }else{

        // Send the newQuery
        thecommercialSQL.query(newQuery, function (err, results) {
          if (err|(!results)){
            res.json({error: err.sqlMessage})
            next('\nSQL ERROR:\n'+err.sqlMessage+'\n' +newQuery)
          }else{
            console.log('--------------\nsucceful query\n-------------\n');
            res.json(results)
          }
        })
      }
      console.log(newQuery);
    });
  }
})

app.listen(3000, () => {
  console.log('Running on port 3000')
});
