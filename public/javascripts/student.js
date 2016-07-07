function securityModal(getUrl,title) {
  $.get(getUrl,function (res) {
    if (res != '')
      $('#securityModal .modal-title').html(title);
      $('#securityModal .modal-body').html(res);
      $('#securityModal').modal();
  });
};

$('#securityPwd').click(function () {
  securityModal('/student/security/password','修改密码');
});
$('#securityEmail').click(function () {
  securityModal('/student/security/email','修改邮箱');
});
$('#securityPhone').click(function () {
  securityModal('/student/security/phone','修改手机号码');
});
$('#securityPayPwd').click(function () {
  securityModal('/student/security/paypwd','修改支付密码');
});
