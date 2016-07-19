var Role = require('../models/role');
var _ = require('underscore');

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.redirect('/role/list');
});

/* GET home page. */
router.get('/list', function (req, res, next) {
    Role.list(function (err, roles) {
        res.render('./role/list', {
            title: '角色列表'
            , roles: roles
        });
    })
});

router.get('/create', function (req, res) {
    res.render('./role/create', {
        title: '添加角色'
    });
});

router.post('/create', function (req, res) {
    var _role = req.body.role;
    role = new Role(_role);
    role.save(function (err, role) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/role/list');
        }
    });
});

router.get('/edit/:id', function (req, res) {
    var id = req.params.id;
    Role.findById(id, function (err, role) {
        res.render('./role/edit', {
            title: '保存角色'
            , role: role
        });
    });
});

router.post('/edit', function (req, res) {
    var formRole = req.body.role;

    Role.findById(formRole._id, function (err, role) {
        var _role = _.extend(role, formRole);
        _role.save(function (err, role) {
            res.render('./role/detail', {
                title: '更新角色'
                , role: role
            });
        });
    });
});

router.get('/detail/:id', function (req, res) {
    var id = req.params.id;
    Role.findById(id, function (err, role) {
        res.render('./role/detail', {
            title: '角色详情'
            , role: role
        });
    });
});

module.exports = router;