var express = require('express');
var mongoose = require('mongoose');
var net = require('net');
var router = express.Router();

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

var kittySchema = new mongoose.Schema({
  name: String
});
kittySchema.methods.speak = function () {
  var greeting = this.name ? "Meow name is " + this.name : "I don't have a name";
  console.log(greeting);
}

mongoose.connect('mongodb://localhost:27017/');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  var Kitten = mongoose.model('Kitten', kittySchema);
  var silence = new Kitten({ name: 'Silence' });
  console.log(silence.name); 
  var fluffy = new Kitten({ name: 'fluffy' });
  fluffy.speak(); 
});

router.get('/', function(req, res, next) {
  var client = net.connect({port: 8126}, function() {
    console.log('client connected in route /');
    client.write('world!\n');
  });
  client.on('data', function(data) {
    console.log(data.toString());
    client.end();
  });
  client.on('end', function() {
    console.log('client disconnected in route /');
  });

  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    var myobj = { name: "Company Inc", address: "Highway 37" };
    dbo.collection("customers").insertOne(myobj, function(err, res) {
      if (err) throw err;
      console.log("1 document inserted");
      db.close();
    });
  });
  res.send('done');
});



module.exports = router;
