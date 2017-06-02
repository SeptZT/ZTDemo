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

    this._back($ele);

    this._scroll($ele);
  }

  _back($ele) {
    let $obj = $(this.opts.selector);
    let dest = this.opts.dest;

    $ele.off('click').on('click', () => {
      if($obj.scrollTop() != dest && !$obj.is(':animated')) {
        $obj.animate({
          scrollTop: dest
        }, this.opts.speed);
      }
    });
  }

  _scroll($ele) {
    let $obj = this.opts.selector === 'body' ? $(document) : $(this.opts.selector);  // body的scroll方法有问题
    let pos = this.opts.pos;

    $obj[0].onscroll = function() {
      if($obj.scrollTop() >= pos && $ele.is(':hidden')) {
        $ele.show();
      } else if ($obj.scrollTop() < pos && $ele.is(':visible')) {
        $ele.hide();
      }
    }
  }
}

$.fn.backTop = function (opts) {
  new BackTop(this, opts);
  return this;
};

//if (module && module.exports) {
//module.exports = function(ele, opts) {
//  return new BackTop(ele, opts);
//};
//}
/* *
 * 参数说明：
 *  opts = {
 *    selector: 滚动的对象的选择器; 缺省值 body
 *    pos: 回到顶部出现的位置; 缺省值 $(window).height()
 *    dest: 设置滚动条回到的指定高度; 缺省值 回到顶部即0
 *    speed: 回到顶部需要的时间; 缺省值 600ms
 *  }
 * */

