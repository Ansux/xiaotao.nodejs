var express = require('express');
var router = express.Router();
var _ = require('underscore');

var Student = require('../models/student');
var Area = require('../models/area');
var Address = require('../models/address');
var Product = require('../models/product');
var Store = require('../models/store');
var Cart = require('../models/cart');
var Order = require('../models/order');
var Orderitem = require('../models/orderItem');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.redirect('/student/list');
});

router.get('/signup', function (req, res) {
    res.render('./student/signup', {
        title: '学生注册'
    });
});
router.post('/signup', function (req, res) {
    var _student = req.body.student;
    var student = new Student(_student);
    student.save(function (err, student) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/student/list');
        }
    });
});

router.get('/signin', function (req, res) {
    if (req.session.student) {
        res.redirect('/student');
    }
    res.render('./student/signin', {
        title: '学生注册'
    });
});
router.post('/signin', function (req, res) {
    var uname = req.body.uname;
    var upwd = req.body.upwd;

    Student.findOne({
        email: uname
    }, function (err, student) {
        if (!student) {
            res.redirect('/student/signin');
        }
        student.validPwd(upwd, function (result) {
            if (result) {
                req.session.student = student;
                res.redirect('/');
            } else {
                res.redirect('/student/signin');
            }
        });
    });
});

router.get('/signout', function (req, res) {
    delete req.session.student;
    res.redirect('/');
});

router.get('/setting', function (req, res) {
    var id = req.params.id;
    Student.findById(id, function (err, student) {
        res.render('./student/edit', {
            title: '更新学生'
            , student: student
        });
    });
});
router.post('/setting', function (req, res) {
    var formStu = req.body.student;
    Student.findById(formStu._id, function (err, stu) {
        var _stu = _.extend(stu, formStu);
        _stu.save(function (err, student) {
            res.redirect('/student/detail/' + student._id);
        });
    });
});

router.post('/password', function (req, res) {
    var formStudent = req.body.student;

    Student.password(formStudent._id, formStudent.pwd, function () {
        res.redirect('/student/list');
    });
});

router.get('/address', function (req, res) {
    res.render('./student/address', {
        title: '收货地址'
    });
});
router.post('/area', function (req, res) {
    Area.list(function (err, areas) {
        res.json(areas);
    });
});
router.post('/address', function (req, res) {
    var student = req.session.student._id;
    Address.list(student, function (err, addrs) {
        res.json(addrs);
    });
});
router.post('/address/save', function (req, res) {
    var formAddr = req.body.addr
        , _addr;
    var student = req.session.student._id;

    // 默认地址处理
    if (formAddr.isDefault == 'true') {
        Address.list(student, function (err, addrs) {
            if (addrs.length > 0) {
                addrs.forEach(function (v, k) {
                    if (v.isDefault == true) {
                        if (v._id != formAddr._id) {
                            v.isDefault = false;
                            v.save(function (err, a) {});
                        }
                    }
                });
            }
        });
    }
    // 新增的地址
    if (formAddr._id === undefined) {
        formAddr.student = student;
        _addr = new Address(formAddr);
        _addr.save(function (err, addr) {
            res.json(addr);
        });
    } else {
        // 修改地址
        Address.findById(formAddr._id, function (err, addr) {
            _addr = _.extend(addr, formAddr);
            _addr.save(function (err, addr) {
                res.json(addr);
            });
        });
    }
});
router.post('/address/delete', function (req, res) {
    var id = req.body.id;
    Address.remove({
        _id: id
    }, function (err, addr) {
        if (err) {
            res.json(false);
        } else {
            res.json(true);
        }
    });
});

router.get('/cart', function (req, res) {
    res.render('./student/cart', {
        title: '购物车'
    });
});
router.post('/cart', function (req, res) {
    var product = req.body.proId;
    var number = req.body.number;
    var student = req.session.student._id;
    var store;
    Product.findById(product, function (err, pro) {
        store = pro.store;
        Cart.list(student, function (err, cart) {
            if (cart == null) {
                cart = new Cart({
                    student: student
                    , stores: [
                        {
                            store: store
                            , prolist: [{
                                product: product
                                , number: number
                        }]
                    }
                ]
                });
                cart.save(function (err, cart) {
                    res.redirect('/student/cart');
                });
            } else {
                var storeIndex = GetArrIndexById(cart.stores, 's', store._id);
                if (storeIndex > -1) {
                    var productIndex = GetArrIndexById(cart.stores[storeIndex].prolist, 'p', product);
                    if (productIndex > -1) {
                        cart.stores[storeIndex].prolist[productIndex].number += parseInt(number);
                    } else {
                        cart.stores[storeIndex].prolist.unshift({
                            product: product
                            , number: number
                        });
                    }
                } else {
                    cart.stores.unshift({
                        store: store._id
                        , prolist: [
                            {
                                product: product
                                , number: number
                        }
                    ]
                    });
                }
                cart.save(function (err, cart) {
                    res.redirect('/student/cart');
                });
            }
        });
    });
});
router.get('/getCart', function (req, res) {
    var student = req.session.student._id;
    Cart.list(student, function (err, carts) {
        res.json(carts);
    });
});

function GetArrIndexById(arr, type, value) {
    for (var i = 0, n = arr.length; i < n; i++) {
        if (type == 's') {
            if (arr[i].store._id.toString() == value) {
                return i;
            }
        } else {
            if (arr[i].product._id.toString() == value) {
                return i;
            }
        }
    }
    return -1;
}

router.post('/ngcart', function (req, res) {
    var student = req.session.student._id;
    var action = req.body.action;
    var pid = req.body.product;
    var product;
    Product.findById(pid, function (err, pro) {
        product = pro;
    });
    Cart.list(student, function (err, cart) {
        var storeIndex = GetArrIndexById(cart.stores, 's', product.store._id);
        var prolist = cart.stores[storeIndex].prolist;
        var proIndex = GetArrIndexById(prolist, 'p', product._id);

        if (action == 'delete') {
            prolist.splice(proIndex, 1);
            if (prolist.length == 0) {
                cart.stores.splice(storeIndex, 1);
            }
        } else if (action == 'plus') {
            prolist[proIndex].number += 1;
        } else if (action == 'minus') {
            prolist[proIndex].number -= 1;
        } else if (action == 'num') {
            var num = req.body.number;
            prolist[proIndex].number = num;
        }
        cart.save(function (err, cart) {
            res.json(true);
        });
    });

});
router.post('/settle', function (req, res) {
    var carts = JSON.parse(req.body.products);
    var stores = [];

    var promise = new Promise(function (resolve, reject) {
        carts.forEach(function (v, k) {
            Product.findById(v.product, function (err, pro) {
                if (stores.length == 0) {
                    stores.push({
                        store: pro.store
                        , prolist: [{
                            product: pro
                            , number: v.number
                        }]
                    });
                } else {
                    var storeIndex = GetArrIndexById(stores, 's', pro.store._id);
                    if (storeIndex != -1) {
                        stores[storeIndex].prolist.push({
                            product: pro
                            , number: v.number
                        });
                    } else {
                        stores.push({
                            store: pro.store
                            , prolist: [{
                                product: pro
                                , number: v.number
                        }]
                        });
                    }
                }
                if (k == (carts.length - 1)) {
                    resolve(stores)
                }
            });
        });
    });

    promise.then(function (stores) {
        req.session.settle = stores;
        res.render('./student/order/settle', {
            title: '购物结算'
            , stores: stores
        });
    });
});

router.post('/order/create', function (req, res) {
    var stores = req.session.settle;
    var addrId = req.body.addr;
    var student = req.session.student._id;
    var cartItems = []
        , orders = []
        , orderObj = {}
        , orderItem = {}
        , _order, _orderItem;

    // 创建订单
    Address.findById(addrId, function (err, addr) {
        orderObj.receiver = addr.receiver;
        orderObj.addr = addr.addr;
        orderObj.phone = addr.phone;
        orderObj.status = 1;
        orderObj.buyer = student;
        orderObj.amount = 0;

        stores.forEach(function (v, k) {
            orderObj.store = v.store._id;
            v.prolist.forEach(function (p, i) {
                cartItems.push(p);
                orderObj.amount += p.number * p.product.price;
            });
            _order = new Order(orderObj);
            _order.save(function (err, order) {
                v.prolist.forEach(function (pro, index) {
                    orderItem.oid = order._id;
                    orderItem.product = pro.product._id;
                    orderItem.price = pro.product.price;
                    orderItem.number = pro.number;
                    _orderItem = new Orderitem(orderItem);
                    _orderItem.save(function (err, oi) {});
                });
            });
        });
    });

    // 删除购物车中相关的条目
    Cart.list(student, function (err, cart) {
        var storeIndex, prolist, proIndex;
        cartItems.forEach(function (v, k) {
            storeIndex = GetArrIndexById(cart.stores, 's', v.product.store._id);
            prolist = cart.stores[storeIndex].prolist;
            proIndex = GetArrIndexById(prolist, 'p', v.product._id);

            prolist.splice(proIndex, 1);
            if (prolist.length == 0) {
                cart.stores.splice(storeIndex, 1);
            }
        });
        cart.save(function (err, cart) {
            delete req.session.settle;
        });
    });

    res.render('./student/order/create', {
        title: '订单创建'
        , stores: stores
    });
});
router.get('/orders', function (req, res) {
    var student = req.session.student._id;

    Order.stuOrders(student, function (err, orders) {
        var promise = new Promise(function (resolve, reject) {
            orders.forEach(function (v, k) {
                Orderitem.findByOid(v._id, function (err, ois) {
                    v.oitems = ois;
                    if (k == (orders.length - 1)) {
                        resolve(orders);
                    };
                });
            });
        });
        promise.then(function (orders) {
            res.render('./student/order/list', {
                title: '我的订单'
                , orders: orders
            });
        }, function (value) {

        });
    });
});


module.exports = router;
