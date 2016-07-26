$('.security-modal').click(function () {
  var url = '/student/security/' + $(this).attr('data-url');
  var title = $(this).attr('data-title');
  $.get(url,function (res) {
    if (res !== '')
      $('#securityModal .modal-title').html(title);
      $('#securityModal .modal-body').html(res);
      setTimeout(function () {
        $('#securityModal').modal();
      }, 50);
  });
});

$('#submit_comment').click(function (e) {
  var flag = true;
  $('.mark').each(function (k,v) {
    var radio = $(v).find('input:checked');
    if (radio.length === 0){
      flag = false;
      return;
    }
  });
  if (!flag) e.preventDefault();
});
