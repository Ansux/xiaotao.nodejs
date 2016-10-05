var express = require('express');
var router = express.Router();

var Product = require('../models/product');
var Orderitem = require('../models/orderItem');
var Store = require('../models/store');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Express'
  });
});

router.get('/prolist', function(req, res, next) {
  var kw = req.query.kw ? req.query.kw : '',
    reKw = new RegExp(kw);
  Product.count({
    name: reKw
  }, function(err, count) {
    var showNumber = 8;
    var pageCount = count % showNumber === 0 ? (count / showNumber) : Math.ceil(count / showNumber);
    var pageCurrent = req.query.p === undefined ? 1 : req.query.p;
    Product.list({
      name: reKw
    }, showNumber, pageCurrent, function(err, products) {
      res.render('./product/list', {
        title: '商品列表',
        kw: kw,
        pageCount: pageCount,
        pageCurrent: pageCurrent,
        products: products
      });
    });
  });
});

router.get('/store/:id', function(req, res, next) {
  var id = req.params.id;
  var promise = new Promise(function (resolve,reject) {
    Store.findById(id, function (err, store) {
      if (err) reject(err);
      resolve(store);
    });
  });

  promise.then(function (store) {
    Product.count({
      store: id
    }, function(err, count) {
      var showNumber = 8;
      var pageCount = count % showNumber === 0 ? (count / showNumber) : Math.ceil(count / showNumber);
      var pageCurrent = req.query.p === undefined ? 1 : req.query.p;
      Product.list({
        store: id
      }, showNumber, pageCurrent, function(err, products) {
        res.render('./index/store', {
          title: '[店铺]' + store.name,
          store: store,
          pageCount: pageCount,
          pageCurrent: pageCurrent,
          products: products
        });
      });
    });
  });
});

router.get('/product/detail/:id', function(req, res, next) {
  var id = req.params.id;
  Product.findById(id, function(err, product) {
    Orderitem.getCommentCount(id, function(err, count) {
      res.render('./product/detail', {
        title: '商品详情',
        product: product,
        count: count
      });
    });
  });
});

router.get('/product/getComments/:id', function(req, res, next) {
  var id = req.params.id;
  Orderitem.findByProId(id, function(err, comments) {
    res.json(comments);
  });
});

module.exports = router;
