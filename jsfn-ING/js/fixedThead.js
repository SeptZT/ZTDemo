function make_thead(div_id, scroll_height){
    var position_top = $(".top").outerHeight(true) + $('.title').height() - 1;
    var new_head = $("#" + div_id + " table thead").clone(true).addClass("new_head").addClass("hide");
    $("#" + div_id + " table thead").after(new_head);
    new_head.css({'position':'fixed', 'top':position_top, 'z-index':'99'});
    redraw();
    //滚动数据，表头固定在顶部
    $(window).scroll(function(){
        var table_scrollTop = $(window).scrollTop();
        //滚动到设定的位置，将原表头隐藏，固定新表头
        if(table_scrollTop > scroll_height){
            redraw();
            new_head.removeClass("hidden");
        } else {
            new_head.addClass("hidden");
        }
    });
    //窗口改变大小重绘
    $(window).resize(function(){
        redraw();
    });
    function redraw(){
        new_head.find("tr td").each(function(index){
            $(this).width($("#" + div_id + " table thead tr td").eq(index).width());
            $(this).height(20);
        });
    }
}

/*// 加载更多
  loadMore: function() {
    var _this = this;

    $('#loadMore').off('click').on('click', function () {
      $('#loadMore').hide();
      $('.load_img').show();
      pagenum++;
      _this.loadList('loadMore');
    });
  },

  // 滚动加载
  scrollLoad: function() {
    $(window).on('scroll', function() {
      if ($('#loadMore').css('display') == 'none') {
        return;
      }
      var height = $(window).height();
      var height2 = $(document).height();
      var scrollTop = $(document).scrollTop();
      if (height + scrollTop == height2) {
        $('#loadMore').click();
      }
    });
  },*/