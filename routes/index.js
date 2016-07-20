var express = require('express');
var router = express.Router();

var Product = require('../models/product');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Express'
  });
});

router.get('/prolist', function(req, res, next) {
  Product.count(function(err, count) {
    var showNumber = 8;
    console.log('总页数： '+Math.ceil(count / showNumber));
    var pageCount = count % showNumber === 0 ? (count / showNumber) : Math.ceil(count / showNumber);
    var pageCurrent = req.query.p === undefined ? 1 : req.query.p;
    Product.list(showNumber, pageCurrent, function(err, products) {
      res.render('./product/list', {
        title: '商品列表',
        pageCount: pageCount,
        pageCurrent: pageCurrent,
        products: products
      });
    });
  });
});

router.get('/product/detail/:id', function(req, res, next) {
  var id = req.params.id;
  Product.findById(id, function(err, product) {
    res.render('./product/detail', {
      title: '商品详情',
      product: product
    });
  });
});

module.exports = router;
