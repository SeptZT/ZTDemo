class BackTop {
  constructor (ele, opts) {
    this.DEFAULTS = { //默认参数
      obj: $('body'),
      pos: $(window).height(),
      speed: 600,
      dest: 0,
    }

    this.opts = $.extend({}, this.DEFAULTS, opts);

    let $ele = $.extend({}, $(this), $(ele));

    $ele.off('click').on('click', this._move.bind(this));

    this.opts.obj.on('scroll', this._checkPosition.bind(this, $ele));
  }

  _move() {
    let obj = this.opts.obj,
        dest = this.opts.dest;

    if (obj.scrollTop() != dest && !obj.is(':animated')) {  //如果滚动条没有在指定位置, 并且点击回到顶部时滚动条处于静止状态
      obj.animate({
        scrollTop: dest
      }, this.opts.speed);
    }
  }

  _checkPosition($ele) {
    let opts = this.opts;

    if (opts.obj.scrollTop() > opts.pos) {
      $ele.fadeIn('slow');
    } else {
      $ele.fadeOut();
    }
  }
}

/* *
 * 封装成jQuery方法
 * */
$.fn.extend({
  backTop: function(opts){
    return $(this).each(function(){
      new BackTop(this, opts);
    });
  }
});

/* *
 * 调用方法：
 * $(ele).backTop(opts); 如
 * $('#back_top').backTop({"speed": 100, "dest": "300px"});
 * 参数说明： opts为可选参数：
 *  opts = {
 *    obj: 滚动的对象; 默认$('body')
 *    pos: 回到顶部出现的位置; 默认$(window).height()
 *    dest: 设置滚动条回到的指定高度; 默认回到顶部即0
 *    speed: 回到顶部需要的时间; 默认600ms
 *  }
 * */

