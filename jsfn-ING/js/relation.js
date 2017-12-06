class Graph {
  constructor(ele, opts) {
    this.DEFAULTS = {
      //默认参数
      selector: 'body',
      pos: $(window).height(),
      speed: 600,
      dest: 0
    }

    this.opts = $.extend({}, this.DEFAULTS, opts)

    let $ele = $.extend({}, $(this), $(ele))

    this._back($ele)

    this._scroll($ele)
  }
}
