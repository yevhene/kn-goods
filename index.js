const bodyParser = require('body-parser');
const express = require('express');
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const ObjectId = mongodb.ObjectId;

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

const mongoUrl = 'mongodb://localhost:27017/shop';
let mongo;
MongoClient
  .connect(mongoUrl, { useNewUrlParser: true })
  .then(function(client) {
    mongo = client.db();
  });

// Index
app.get('/', function(_req, res) {
  res.redirect('/goods');
});


// Index
app.get('/goods', function(req, res) {
  mongo
    .collection('goods').find().toArray()
    .then(function(goods) {
      res.render('goods/index', { goods });
    });
});

// New
app.get('/goods/new', function(req, res) {
  res.render('goods/new');
});

// Show
app.get('/goods/(:id)', function(req, res) {
  mongo
    .collection('goods')
    .findOne({ _id: ObjectId(req.params.id) })
    .then(function(goodsItem) {
      res.render('goods/show', { goodsItem });
    });
});

// Create
app.post('/goods', function(req, res) {
  mongo
    .collection('goods')
    .insertOne(req.body)
    .then(function() {
      res.redirect('/goods');
    });
});

app.listen(3000, function() {
  console.log('App started at http://localhost:3000');
});
