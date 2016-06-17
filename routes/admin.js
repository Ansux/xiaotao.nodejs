var express = require('express');
var router = express.Router();
var _ = require('underscore');

var Role = require('../models/role');
var Student = require('../models/student');
var Area = require('../models/area');

var Store = require('../models/store');
var Category = require('../models/category');
var Product = require('../models/product');

router.get('/', function (req, res) {
    res.redirect('/admin/role/list');
});
// role-router
router.get('/role', function (req, res, next) {
    res.redirect('/admin/role/list');
});
router.get('/role/list', function (req, res, next) {
    Role.list(function (err, roles) {
        res.render('./admin/role/list', {
            title: '角色列表'
            , roles: roles
        });
    })
});
router.get('/role/create', function (req, res) {
    res.render('./admin/role/create', {
        title: '添加角色'
    });
});
router.post('/role/create', function (req, res) {
    var _role = req.body.role;
    var role = new Role(_role);
    role.save(function (err, role) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/admin/role/list');
        }
    });
});
router.get('/role/edit/:id', function (req, res) {
    var id = req.params.id;
    Role.findById(id, function (err, role) {
        res.render('./admin/role/edit', {
            title: '保存角色'
            , role: role
        });
    });
});
router.post('/role/edit', function (req, res) {
    var formRole = req.body.role;

    Role.findById(formRole._id, function (err, role) {
        var _role = _.extend(role, formRole);
        _role.save(function (err, role) {
            res.redirect('/admin/role/detail/' + role._id);
        });
    });
});
router.get('/role/detail/:id', function (req, res) {
    var id = req.params.id;
    Role.findById(id, function (err, role) {
        res.render('./admin/role/detail', {
            title: '角色详情'
            , role: role
        });
    });
});

// category-router
router.get('/category', function (req, res, next) {
    res.redirect('category/list');
});
router.get('/category/list', function (req, res, next) {
    Category.list(function (err, categories) {
        res.render('./admin/category/list', {
            title: '角色列表'
            , categories: categories
        });
    })
});
router.get('/category/create', function (req, res) {
    res.render('./admin/category/create', {
        title: '添加角色'
    });
});
router.post('/category/create', function (req, res) {
    var _category = req.body.category;
    var category = new Category(_category);
    category.save(function (err, category) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/admin/category/list');
        }
    });
});
router.get('/category/edit/:id', function (req, res) {
    var id = req.params.id;
    Category.findById(id, function (err, category) {
        res.render('./admin/category/edit', {
            title: '保存角色'
            , category: category
        });
    });
});
router.post('/category/edit', function (req, res) {
    var formCategory = req.body.category;

    Category.findById(formCategory._id, function (err, category) {
        var _category = _.extend(category, formCategory);
        _category.save(function (err, category) {
            res.render('./category/detail', {
                title: '更新角色'
                , category: category
            });
        });
    });
});
router.get('/category/detail/:id', function (req, res) {
    var id = req.params.id;
    Category.findById(id, function (err, category) {
        res.render('./admin/category/detail', {
            title: '角色详情'
            , category: category
        });
    });
});

router.get('/store', function (req, res) {
    res.redirect('/admin/store/list');
});
router.get('/store/list', function (req, res) {
    Store.list(function (err, stores) {
        res.render('./admin/store/list', {
            title: '店铺列表'
            , stores: stores
        });
    });
});

module.exports = router;