const express = require('express');
const app = express();
const stripe = require('stripe')('sk_test_TjxMfQT2AWTxxvWFvTAAcpRI00o4FDVzae');
const fs = require('fs');
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "node",
  password: "N0D3U5ER",
  database: "thecommercial"
});

var myquerys = require('./myquerys.json');


app.all('/', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next()
});

con.connect(function(err) {
  if (err) {
    console.log(err)
  }else{
    app.get('/secret/:items/:quantity', async (req, res, next) => {
      res.header("Access-Control-Allow-Origin", "*");

      var items = req.params.items;
      var quantity = req.params.quantity;

      var obj = [];
      var regexp1  = RegExp('^([0-9]|,| )*[0-9]$', 'g');
      var regexp2  = RegExp('^([0-9]|,| )*[0-9]$', 'g');
      if(regexp1.test(items)&&regexp2.test(quantity)){
        var query = 'select *, max(list_price) price from artwork_historic_prices where artwork_id in (' + items + ') group by artwork_id';
        con.query(query, function (err, results) {
          if (err|(!results)){
            res.json({error: err.sqlMessage})
            next('\nSQL ERROR:\n'+err.sqlMessage+'\n' +query)
          }else{
            var total = 0;
            quantity = quantity.replace(' ', '').split(',')
            for(var i in results){
              var p = results[i].price
              var q = quantity[i]?quantity[i]:0;
              total += p*q;
              obj.push({price: p, qty: q, subtotal: p*q});
            }
            obj = {cart: obj, total: total};
            if(obj.total){
              (async () => {
                const intent = await stripe.paymentIntents.create({
                  amount: total,
                  currency: 'aud',
                  payment_method_types: ['card'],
                });
                obj['client_secret'] = intent.client_secret;
                console.log(obj)
                res.json(obj);
              })();
            }
          }
        })
      }
    });

    app.get('/query/:query_name*', async (req, res, next) => {
      console.log(req.protocol + '://' + req.get('host') + req.originalUrl);
      res.header("Access-Control-Allow-Origin", "*");

      var query = myquerys[req.params.query_name];
      var args = req.params[0];
      var ext = '';
      if(!!args ){
        args = args.split('/');
        var regexp  = RegExp('^([0-9]|,| )*[0-9]$', 'g');
        if(args[1]&&regexp.test(args[1])){
          ext = args[1];
          if(!!args[2]){
            if(args[2].toUpperCase() == 'BETWEEN'){
              ext = ' BETWEEN ' + ext.replace(',', ' AND ');
            }else if(args[2].toUpperCase() == 'IN'){
              ext = ' IN (' + ext + ')';
            }else{
              res.json({error: 'Invalid operatoin: ' + args[2]});
              next('\nARGUMENT ERROR:\nInvalid operatoin: ' + args[2]);
              return
            }
          }else{
            regexp  = RegExp('^[0-9]*$', 'g');
            if(regexp.test(ext)){
              ext = ' = ' + ext;
            }else{
              res.json({error: 'Invalid arguments: \'' + ext + '\' for given operation \'=\''});
              next('\nARGUMENT ERROR:\nInvalid arguments: \'' + ext + '\' for given operation \'=\'');
              return
            }
          }
        }else{
          res.json({error: 'Invalid arguments: ' + args[1]});
          next('\nARGUMENT ERROR:\nInvalid arguments: ' + args[1]);
          return
        }
      }

      query += ext;
      console.log(query);
      con.query(query, function (err, results) {
        if (err|(!results)){
          res.json({error: err.sqlMessage})
          next('\nSQL ERROR:\n'+err.sqlMessage+'\n' +query)
        }else{
          console.log('--------------\nsucceful query\n-------------\n');
          res.json(results)
        }
      })
    });
  }
})


app.listen(8080, () => {
  console.log('Running on port 3000')
});



// fs.readFile('./myquerys.sql', 'utf8',(err, querys) => {
  //   // remove notes
  //   querys = querys.replace(/(\/\*(.|\n|\r)*\*\/)/gm, "");
  //   // console.log([querys])
  //   // Turn to json string
  //   querys = '{\n' + querys.replace(/(\r|\n)*\-\-(.*)(\r|\n)*/gm, (match, st, key, st2) => {
    //     return '"'+key.replace(' ', "")+'":"'
    //   }).replace(/(\n|\r)/gm, " ").replace(/(\;)/gm, (match, p1, offset, string) => {
      //     return string.length-offset>5?'",\n':'"\n}'
      //   });
      //
      //   fs.writeFile("./myquerys.json", querys, 'utf8', function (err) {
        //     if (err) {
          //         console.log("An error occured while writing JSON Object to File.");
          //         return console.log(err);
          //     }
          //     // console.log(querys);
          //   });
          // });
