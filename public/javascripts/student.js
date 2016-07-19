$('.security-modal').click(function () {
  var url = '/student/security/' + $(this).attr('data-url');
  var title = $(this).attr('data-title');
  $.get(url,function (res) {
    if (res != '')
      $('#securityModal .modal-title').html(title);
      $('#securityModal .modal-body').html(res);
      setTimeout(function () {
        $('#securityModal').modal();
      }, 50);
  });
});
