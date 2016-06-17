// 导航条active状态
(function () {
    var pathname = window.location.pathname;
    var controller = pathname.substr(7);
    if (controller.indexOf('/') > -1) {
        controller = controller.substr(0, controller.indexOf('/'));
    }
    var flag = true;
    $('.navbar-nav>li').each(function (k, v) {
        if ($(v).attr('data-id') == controller) {
            $(v).addClass('active');
            flag = false;
        }
    });
    if (flag) {
        $('.navbar-nav>li').eq(0).addClass('active');
    }
})();