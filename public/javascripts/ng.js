Array.prototype.indexOf = function(val) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == val) return i;
  }
  return -1;
};

Array.prototype.remove = function(val) {
  var index = this.indexOf(val);
  if (index > -1) {
    this.splice(index, 1);
  }
};

Array.prototype.moveToFirst = function(val) {
  var index = this.indexOf(val);
  var first = this[index];
  this.splice(index, 1);
  this.unshift(first);
};

angular.module('root', [], function provider($httpProvider) {
  "use strict";
  $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
  $httpProvider.defaults.transformRequest = [function(data) {
    var param = function(obj) {
      var query = '';
      var name, value, fullSubName, subName, subValue, innerObj, i;
      for (name in obj) {
        value = obj[name];
        if (value instanceof Array) {
          for (i = 0; i < value.length; ++i) {
            subValue = value[i];
            fullSubName = name + '[' + i + ']';
            innerObj = {};
            innerObj[fullSubName] = subValue;
            query += param(innerObj) + '&';
          }
        } else if (value instanceof Object) {
          for (subName in value) {
            subValue = value[subName];
            fullSubName = name + '[' + subName + ']';
            innerObj = {};
            innerObj[fullSubName] = subValue;
            query += param(innerObj) + '&';
          }
        } else if (value !== undefined && value !== null) {
          query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
        }
      }
      return query.length ? query.substr(0, query.length - 1) : query;
    };
    return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
  }];
});

angular.module('myCart', ['root'])
  .controller('myCart',['$scope','$http','$q', function($scope, $http, $q) {
    "use strict";
    $http.get('/student/getCart?t=' + new Date().getTime()).success(function(res) {
      $scope.stores = res.stores;
    });

    // 删除
    $scope.delete = function(store, cart) {
      $http.post('/student/ngcart', {
        action: 'delete',
        product: cart.product._id
      }).success(function(res) {
        if (res === true) {
          store.prolist.remove(cart);
          if (store.prolist.length === 0) {
            $scope.stores.remove(store);
          }
        }
      });
    };

    // 选中事件
    $scope.check = function($event, model, type) {
      var ck = $event.target.checked;
      model.checked = ck;
      if (type === 'all') {
        angular.forEach(model, function(v, k) {
          v.checked = ck;
          angular.forEach(v.prolist, function(d, i) {
            d.checked = ck;
          });
        });
      } else if (type === 'store') {
        angular.forEach(model.prolist, function(v, k) {
          v.checked = ck;
        });
      }
      $scope.refreshChecked();
    };

    // 选中处理
    $scope.items = 0;
    $scope.refreshChecked = function() {
      var items = 0,
        settle;
      // 店铺全选
      angular.forEach($scope.stores, function(store, k) {
        var storeChecked = true;
        angular.forEach(store.prolist, function(cart, i) {
          if (cart.checked === false || cart.checked === undefined) {
            storeChecked = false;
          } else if (cart.checked === true) {
            items += 1;
            settle = true;
          }
        });
        store.checked = storeChecked;
      });

      $scope.items = items;
      $scope.settle = settle;

      // 购物车全选
      var allChecked = true;
      angular.forEach($scope.stores, function(store, k) {
        if (store.checked === false || store.checked === undefined) {
          allChecked = false;
        }
      });
      $scope.stores.checked = allChecked;
    };

    // 添加减少数量
    $scope.cartNum = function(cart, action) {
      if (action === 'minus') {
        if (cart.number > 1) {
          $scope.cartNumPost(cart.product._id, action, null).then(function(v) {
            if (v === true) {
              cart.number -= 1;
            }
          });
        }
      } else if (action === 'plus') {
        if (cart.number < cart.product.stock) {
          $scope.cartNumPost(cart.product._id, action, null).then(function(v) {
            if (v === true) {
              cart.number += 1;
            }
          });
        } else {
          alert('数量已超过商品的库存量！');
        }
      }

    };
    $scope.cartNumPost = function(pid, action, number) {
      var delay = $q.defer();
      $http.post('/student/ngcart', {
        product: pid,
        action: action,
        number: number
      }).success(function(res) {
        delay.resolve(res);
      });
      return delay.promise;
    };
    // 数量input数值监听
    $scope.changeNum = function(cart) {
      var cartNumber;
      if (cart.number < 1) {
        cartNumber = 1;
      } else if (cart.number > cart.product.stock) {
        cartNumber = cart.product.stock;
      } else {
        cartNumber = cart.number;
      }
      $scope.cartNumPost(cart.product._id, 'num', cartNumber).then(function(v) {
        if (v === true) {
          cart.number = cartNumber;
        }
      });
    };
    // 结算总价
    $scope.account = function() {
      var account = 0,
        products = [];
      angular.forEach($scope.stores, function(store, k) {
        angular.forEach(store.prolist, function(cart, i) {
          if (cart.checked === true) {
            account += cart.number * cart.product.price;
            products.push({
              product: cart.product._id,
              number: cart.number
            });
          }
        });
      });
      $scope.products = products;
      return account;
    };
    // 去结算
    $scope.submit = function() {
      var carts = [];
      angular.forEach($scope.stores, function(store, k) {
        angular.forEach(store.prolist, function(cart, i) {
          if (cart.checked) {
            carts.push({
              product: cart.product._id,
              number: cart.number
            });
          }
        });
      });
      $http.post('/student/settle', {
        carts: carts
      }).success(function(res) {

      });
    };
  }]);

angular.module('myAddress', ['root'])
  .controller('myAddress', function($scope, $http) {
    "use strict";
    $scope.addr = {};
    $http.post('/student/area').success(function(res) {
      $scope.areas = res;
      $scope.addr.area = res[0]._id;
    });
    $scope.getAddrs = function() {
      $http.post('/student/address').success(function(res) {
        $scope.addrs = res;
      });
    };
    $scope.getAddrs();

    $scope.submit = function() {
      var addr = $scope.addr;
      $http.post('/student/address/save', {
        addr: addr
      }).success(function(res) {
        $scope.addr = {
          area: $scope.addr.area
        };
        $scope.getAddrs();
        // $scope.addrs.unshift(res);
      });
    };
    $scope.delete = function(index, id) {
      $http.post('/student/address/delete', {
        id: id
      }).success(function(res) {
        if (res === true) {
          $scope.addrs.splice(index, 1);
        }
      });
    };
    $scope.edit = function(model) {
      var addr = {
        _id: model._id,
        receiver: model.receiver,
        area: model.area._id,
        addr: model.addr,
        phone: model.phone,
        isDefault: model.isDefault
      };
      $scope.addr = addr;
    };
  });

angular.module('mySettle', ['root'])
  .controller('mySettle', function($scope, $http) {
    "use strict";
    $http.post('/student/address').success(function(res) {
      var defaultAddr = {};
      angular.forEach(res, function(v, k) {
        if (v.isDefault === true) {
          defaultAddr = v;
          defaultAddr.select = true;
          res.splice(k, 1);
          $scope.hasAddr = defaultAddr;
        }
      });
      res.unshift(defaultAddr);
      $scope.addrs = res;
    });
    $scope.select = function(model) {
      if (model.select !== true) {
        angular.forEach($scope.addrs, function(v, k) {
          if (v.select === true) {
            v.select = undefined;
          }
        });
        model.select = true;
        $scope.hasAddr = model;
      }
    };
  });
