class BackTop {
  constructor (ele, opts) {
    this.DEFAULTS = { //默认参数
      selector: 'body',
      pos: $(window).height(),
      speed: 600,
      dest: 0,
    }

    this.opts = $.extend({}, this.DEFAULTS, opts);

    let $ele = $.extend({}, $(this), $(ele));

    $ele.off('click').on('click', this._move.bind(this));

    $(this.opts.selector).on('scroll', this._checkPosition.bind(this, $ele));
  }

  _move() {
    let obj = $(this.opts.selector);
    let dest = this.opts.dest;

    if (obj.scrollTop() != dest && !obj.is(':animated')) {  //如果滚动条没有在指定位置, 并且点击回到顶部时滚动条处于静止状态
      obj.animate({
        scrollTop: dest
      }, this.opts.speed);
    }
  }

  _checkPosition($ele) {
    let opts = this.opts;

    if ($(opts.selector).scrollTop() > opts.pos) {
      $ele.fadeIn('slow');
    } else {
      $ele.fadeOut();
    }
  }
}

/* *
 * 封装成jQuery方法
 * */
;$.fn.extend({
  backTop: function(opts){
    return $(this).each(function(){
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

