(function() {
  var page = {
    count: parseInt($('#pager').attr('count')),
    current: parseInt($('#pager').attr('current')),
    link: $('#pager').attr('link')
  };

  var html = '<ul class="pagination">';

  // 上一页
  if (page.current > 1) {
    html += '<li><a href="' + page.link + '?p=' + (page.current - 1) + '" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a></li>';
  }

  for (var i = 1; i <= page.count; i++) {
    if (page.current == i) {
      html += '<li class="active"><a>' + i + '</a></li>';
    } else {
      html += '<li><a href="' + page.link + '?p=' + i + '">' + i + '</a></li>';
    }
  }

  // 下一页
  if (page.current < page.count) {
    console.log(page);
    html += '<li><a href="' + page.link + '?p=' + (page.current + 1) + '" aria-label="Next"><span aria-hidden="true">&raquo;</span></a></li>';
  }

  // 结束
  html += '</ul>';
  $('#pager').html(html);
})();
