function BackTop(ele, opts) {
  this.DEFAULTS = { //默认参数
    selector: 'body',
    pos: $(window).height(),
    speed: 600,
    dest: 0,
  }

  this.opts = $.extend({}, this.DEFAULTS, opts);

  var $ele = $.extend({}, $(this), $(ele));

  this._back($ele);

  this._scroll($ele);
}

BackTop.prototype._back = function($ele) {
  var $obj = $(this.opts.selector);
  var dest = this.opts.dest;

  $ele.off('click').on('click', () => {
    console.log(2222);
    $(document).animate({scrollTop: 0}, 500);
    return;
    if($obj.scrollTop() != dest && !$obj.is(':animated')) {
      $obj.animate({
        scrollTop: dest
      }, this.opts.speed);
    }
  });
};

BackTop.prototype._scroll = function($ele) {
  var $obj = this.opts.selector === 'body' ? $(document) : $(this.opts.selector);
  var pos = this.opts.pos;

  $obj.on('scroll', function() {
    if($obj.scrollTop() >= pos && $ele.is(':hidden')) {
      $ele.show();
    } else if ($obj.scrollTop() < pos && $ele.is(':visible')) {
      $ele.hide();
    }
  });
};

/* *
 * 封装成jQuery方法
 * */
;
$.fn.extend({
  backTop: function(opts) {
    return $(this).each(function() {
      new BackTop(this, opts);
    });
  }
});

/* *
 * 调用方法：
 * $(ele).backTop(opts); 如
 * $('#back_top').backTop({'speed': 100, 'dest': '300px'});
 * 参数说明： opts为可选参数：
 *  opts = {
 *    selector: 滚动的对象的选择器; 缺省值 body
 *    pos: 回到顶部出现的位置; 缺省值 $(window).height()
 *    dest: 设置滚动条回到的指定高度; 缺省值 回到顶部即0
 *    speed: 回到顶部需要的时间; 缺省值 600ms
 *  }
 * */