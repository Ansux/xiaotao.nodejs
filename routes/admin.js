var express = require('express');
var router = express.Router();
var _ = require('underscore');

var Role = require('../models/role');
var Student = require('../models/student');
var Area = require('../models/area');
var Admin = require('../models/admin');
var Store = require('../models/store');
var Category = require('../models/category');
var Product = require('../models/product');

var sessionAdmin;
router.get('*', function(req, res, next) {
  sessionAdmin = req.session.admin;
  var url = req.url;
  if (['/signin', '/signup'].indexOf(url) > -1) {
    next();
  } else {
    if (!sessionAdmin) {
      return res.redirect('/admin/signin');
    }
    next();
  }
});

router.get('/', function(req, res) {
  res.redirect('/admin/role/list');
});

router.get('/signin', function(req, res) {
  if (!sessionAdmin) {
    res.render('./admin/account/signin', {
      title: '管理员登录'
    });
  }
});
router.post('/signin', function(req, res) {
  var uname = req.body.uname;
  var upwd = req.body.upwd;

  Admin.findOne({
    email: uname
  }, function(err, admin) {
    if (!admin) {
      return res.redirect('/admin/signin');
    } else {
      admin.validPwd(upwd, function(result) {
        if (result) {
          req.session.admin = admin;
          res.redirect('/admin');
        } else {
          res.redirect('/admin/signin');
        }
      });
    }
  });
});

router.get('/signup', function(req, res) {
  if (!sessionAdmin) {
    res.render('./admin/account/signup', {
      title: '管理员注册'
    });
  } else {
    return res.redirect('/admin');
  }
});
router.post('/signup', function(req, res) {
  var formAdmin = req.body.admin;
  var admin = new Admin(formAdmin);
  admin.save(function(err, admin) {
    if (err) {
      console.log(err);
    }
    res.redirect('/admin');
  });
});

// role-router
router.get('/role', function(req, res, next) {
  res.redirect('/admin/role/list');
});
router.get('/role/list', function(req, res, next) {
  Role.list(function(err, roles) {
    res.render('./admin/role/list', {
      title: '角色列表',
      roles: roles
    });
  });
});
router.get('/role/create', function(req, res) {
  res.render('./admin/role/create', {
    title: '添加角色'
  });
});
router.post('/role/create', function(req, res) {
  var _role = req.body.role;
  var role = new Role(_role);
  role.save(function(err, role) {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/admin/role/list');
    }
  });
});
router.get('/role/edit/:id', function(req, res) {
  var id = req.params.id;
  Role.findById(id, function(err, role) {
    res.render('./admin/role/edit', {
      title: '保存角色',
      role: role
    });
  });
});
router.post('/role/edit', function(req, res) {
  var formRole = req.body.role;

  Role.findById(formRole._id, function(err, role) {
    var _role = _.extend(role, formRole);
    _role.save(function(err, role) {
      res.redirect('/admin/role/detail/' + role._id);
    });
  });
});
router.get('/role/detail/:id', function(req, res) {
  var id = req.params.id;
  Role.findById(id, function(err, role) {
    res.render('./admin/role/detail', {
      title: '角色详情',
      role: role
    });
  });
});

// category-router
router.get('/category', function(req, res, next) {
  res.redirect('category/list');
});
router.get('/category/list', function(req, res, next) {
  Category.list(function(err, categories) {
    res.render('./admin/category/list', {
      title: '角色列表',
      categories: categories
    });
  });
});
router.get('/category/create', function(req, res) {
  res.render('./admin/category/create', {
    title: '添加角色'
  });
});
router.post('/category/create', function(req, res) {
  var _category = req.body.category;
  var category = new Category(_category);
  category.save(function(err, category) {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/admin/category/list');
    }
  });
});
router.get('/category/edit/:id', function(req, res) {
  var id = req.params.id;
  Category.findById(id, function(err, category) {
    res.render('./admin/category/edit', {
      title: '保存角色',
      category: category
    });
  });
});
router.post('/category/edit', function(req, res) {
  var formCategory = req.body.category;

  Category.findById(formCategory._id, function(err, category) {
    var _category = _.extend(category, formCategory);
    _category.save(function(err, category) {
      res.render('./category/detail', {
        title: '更新角色',
        category: category
      });
    });
  });
});
router.get('/category/detail/:id', function(req, res) {
  var id = req.params.id;
  Category.findById(id, function(err, category) {
    res.render('./admin/category/detail', {
      title: '角色详情',
      category: category
    });
  });
});

router.get('/store', function(req, res) {
  res.redirect('/admin/store/list');
});
router.get('/store/list', function(req, res) {
  Store.list(function(err, stores) {
    res.render('./admin/store/list', {
      title: '店铺列表',
      stores: stores
    });
  });
});

// area-router
router.get('/area', function(req, res, next) {
  res.redirect('/admin/area/list');
});
router.get('/area/list', function(req, res, next) {
  Area.list(function(err, areas) {
    res.render('./admin/area/list', {
      title: '区域列表',
      areas: areas
    });
  });
});
router.get('/area/create', function(req, res) {
  res.render('./admin/area/create', {
    title: '添加区域'
  });
});
router.post('/area/create', function(req, res) {
  var _area = req.body.area;
  var area = new Area(_area);
  area.save(function(err, area) {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/admin/area/list');
    }
  });
});
router.get('/area/edit/:id', function(req, res) {
  var id = req.params.id;
  Area.findById(id, function(err, area) {
    res.render('./admin/area/edit', {
      title: '保存角色',
      area: area
    });
  });
});
router.post('/area/edit', function(req, res) {
  var formArea = req.body.area;

  Area.findById(formArea._id, function(err, area) {
    var _area = _.extend(area, formArea);
    _area.save(function(err, area) {
      res.redirect('/admin/area/detail/' + area._id);
    });
  });
});
router.get('/area/detail/:id', function(req, res) {
  var id = req.params.id;
  Area.findById(id, function(err, area) {
    res.render('./admin/area/detail', {
      title: '角色详情',
      area: area
    });
  });
});

router.get('/student', function(req, res) {
  res.redirect('/admin/student/list');
});

router.get('/student/list', function(req, res) {
  Student.list(function(err, stus) {
    res.render('./admin/student/list', {
      title: '学生列表',
      stus: stus
    });
  });
});

router.get('/product', function(req, res) {
  var pageCurrent = req.query.p === undefined ? 1 : req.query.p;
  var showNum = 10;
  Product.count(function(err, count) {
    var pageCount = count % showNum === 0 ? (count / showNum) : Math.ceil(count / showNum);
    Product.list(showNum, pageCurrent, function(err, pros) {
      res.render('./admin/product/list', {
        title: '商品列表',
        products: pros,
        pageCount: pageCount,
        pageCurrent: pageCurrent
      });
    });
  });
});

module.exports = router;
