var express = require('express');
var router = express.Router();

var _ = require('underscore');
var Store = require('../models/store');
var Product = require('../models/product');
var Category = require('../models/category');
var Order = require('../models/order');
var Orderitem = require('../models/orderitem');

// 登录验证，获取当前登录的用户
var sessionStore;
router.get('*', function (req,res,next) {
  sessionStore = req.session.store;
  var url = req.url;
  if (['/signin','/signup'].indexOf(url) > -1) {
    next();
  }else{
    if (!sessionStore) {
        return res.redirect('/store/signin');
    }
    next();
  }
});

router.get('/', function(req, res) {
  res.render('./store/index', {
    title: '店铺中心'
  });
});

router.get('/signup', function(req, res) {
  res.render('./store/signup', {
    title: '店铺入驻'
  });
});
router.post('/signup', function(req, res) {
  var formStore = req.body.store;
  var store = new Store(formStore);
  console.log(store);
  store.save(function(err, store) {
    if (err) console.log(err);
    res.redirect('/store');
  });
});

router.get('/signin', function(req, res) {
  res.render('./store/signin', {
    title: '店铺登录'
  });
});
router.post('/signin', function(req, res) {
  var uname = req.body.uname;
  var upwd = req.body.upwd;

  Store.findOne({
    email: uname
  }, function(err, store) {
    if (!store) {
      res.redirect('/store/signin');
    } else {
      store.validPwd(upwd, function(result) {
        if (result) {
          req.session.store = store;
          res.redirect('/store');
        } else {
          res.redirect('/store/signin');
        }
      });
    }
  });
});

router.get('/signout', function(req, res) {
  delete req.session.store;
  res.redirect('/store');
});

router.get('/prolist', function(req, res) {
  Product.store(sessionStore._id, function(err, products) {
    res.render('./store/product/list', {
      title: '商品列表',
      products: products
    });
  });
});

router.get('/product/create', function(req, res) {
  Category.list(function(err, categories) {
    res.render('./store/product/create', {
      title: '发布商品',
      categories: categories
    });
  });
});
router.post('/product/create', function(req, res) {
  var formProduct = req.body.product;
  formProduct.store = sessionStore._id;
  var product = new Product(formProduct);
  product.save(function(err, product) {
    res.redirect('/store/prolist');
  });
});

router.get('/orders', function(req, res) {
  Order.StoreOrders(sessionStore._id, function(err, orders) {
    var promise = new Promise(function(resolve, reject) {
      if (orders.length === 0) {
        resolve(orders);
      }
      orders.forEach(function(v, k) {
        Orderitem.findByOid(v._id, function(err, ois) {
          v.oitems = ois;
          if (k == (orders.length - 1)) {
            resolve(orders);
          }
        });
      });
    });
    promise.then(function(orders) {
      res.render('./store/orders', {
        title: '订单列表',
        orders: orders
      });
    });
  });
});

router.get('/delivery/:id', function(req, res) {
  var id = req.params.id;
  Order.findById(id, function(err, order) {
    Orderitem.findByOid(id, function(err, ois) {
      res.render('./store/delivery', {
        title: '发货',
        order: order,
        ois: ois
      });
    });
  });
});

router.get('/baseinfo', function(req, res) {
  res.render('./store/baseinfo', {
    title: '基本资料'
  });
});
router.get('/avatar', function(req, res) {
  res.render('./store/avatar', {
    title: '头像设置'
  });
});

module.exports = router;
