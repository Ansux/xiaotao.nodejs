var express = require('express');
var router = express.Router();

var _ = require('underscore');
var Store = require('../models/store');
var Product = require('../models/product');
var Category = require('../models/category');


router.get('/', function (req, res) {
    res.render('./store/index', {
        title: '店铺中心'
    });
});

router.get('/signup', function (req, res) {
    res.render('./store/signup', {
        title: '店铺入驻'
    });
});
router.post('/signup', function (req, res) {
    var formStore = req.body.store;
    var store = new Store(formStore);
    console.log(store);
    store.save(function (err, store) {
        if (err) console.log(err);
        res.redirect('/store');
    });
});

router.get('/signin', function (req, res) {
    res.render('./store/signin', {
        title: '店铺登录'
    });
});
router.post('/signin', function (req, res) {
    var uname = req.body.uname;
    var upwd = req.body.upwd;

    Store.findOne({
        email: uname
    }, function (err, store) {
        if (!store) {
            res.redirect('/store/signin');
        } else {
            store.validPwd(upwd, function (result) {
                if (result) {
                    req.session.store = store;
                    res.redirect('/store');
                } else {
                    res.redirect('/store/signin');
                }
            });
        }
    })
});

router.get('/signout', function (req, res) {
    delete req.session.store;
    res.redirect('/store');
});

router.get('/prolist', function (req, res) {
    var sid = req.session.store._id;
    Product.store(sid, function (err, products) {
        res.render('./store/product/list', {
            title: '商品列表'
            , products: products
        });
    });
});
router.get('/product/create', function (req, res) {
    Category.list(function(err,categories){
        res.render('./store/product/create', {
            title: '发布商品',
            categories:categories
        });
    });
});

router.post('/product/create',function(req,res){
    var formProduct = req.body.product;
    formProduct.store = req.session.store._id;
    var product = new Product(formProduct);
    product.save(function(err,product){
        res.redirect('/store/prolist');
    });
});

module.exports = router;