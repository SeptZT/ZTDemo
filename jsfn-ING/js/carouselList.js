function CarouselList(ele, opts) {
  this.DEFAULTS = { //默认参数
    divide: 0,  // 等分
    spacing: 0,  // 列表项之间的间距
    breakpoints: null // {1366: 3}  响应式：屏幕小于等于1366时,等分成3份
  };

  this.opts = $.extend({}, this.DEFAULTS, opts);

  this.timeoutId = null;
  this.obj = $(ele);
  this.ul = this.obj.find('ul');

  if (opts && (opts.breakpoints || opts.divide)) {
    if (opts.breakpoints) { this._breakpoints(); }
    if (opts.divide) {
      this.divide = this.opts.divide;
      this._completeW();
    }
    this._reSize();
  }

  this._isDisable();
  this._change();
}

CarouselList.prototype._change = function() {
  let _this = this;

  this.obj.find('.list-next, .list-prev').off('click').on('click', function() {
    let ul_left, con_width;

    if ($(this).hasClass('disabled')) {
      return;
    }
    _this.ul.stop(true, true);

    con_width = _this.ul.parent().width();
    ul_left = parseInt(_this.ul.css('left'));
    ul_left = $(this).hasClass('list-prev') ? ul_left + con_width : ul_left - con_width;
    ul_left = ul_left >= 0 ? 0 : ul_left;

    _this.ul.animate({ 'left': ul_left + 'px' });
    _this._isDisable(ul_left);
  });
};

CarouselList.prototype._isDisable = function(left) {
  left = left ? left : parseInt(this.ul.css('left'));
  this.obj.find('.list-prev, .list-next').removeClass('disabled');

  if (left >= 0) {
    this.obj.find('.list-prev').addClass('disabled');
  }
  if (this.ul.width() + left <= this.ul.parent().width()) {
    this.obj.find('.list-next').addClass('disabled');
  }
};

CarouselList.prototype._completeW = function() {
  let old_w = this.ul.find('li').width();
  let li_width = (this.ul.parent().width() - this.opts.spacing * this.divide) / this.divide;

  this.ul.find('li').width(li_width);

  return {old_w: old_w, new_w: li_width};
};

CarouselList.prototype._rePosition = function() {
  let ul_left = parseInt(this.ul.css('left'));
  let li_width = this._completeW();
  let index = parseInt(ul_left / (li_width.old_w + this.opts.spacing));
  let left = index * (li_width.new_w + this.opts.spacing);
  this.ul.css('left', left + 'px');
  this._isDisable();
};

CarouselList.prototype._breakpoints = function() {
  let window_w = $(window).width();
  let points = this.opts.breakpoints;
  let keys = Object.keys(points).sort(function(a, b) { return Number(a) > Number(b) });
  let len;
  let i;

  keys.unshift(0);
  len = keys.length;

  for (i = 0; i < len - 1; i++) {
    if (keys[i] < window_w && keys[i + 1] >= window_w) {
      this.divide = points[keys[i + 1]];
      return;
    }
  }
  this.divide = this.opts.divide;
};

CarouselList.prototype._reSize = function() {
  $(window).resize(function() { this._throttle(); }.bind(this));
};

CarouselList.prototype._throttle = function() {
  clearTimeout(this.timeoutId);

  this.timeoutId = setTimeout(function() {
    if (this.opts && this.opts.breakpoints) {
      this._breakpoints();
    }
    this._rePosition();
  }.bind(this), 200);
};

$.fn.carouselList = function(opts) {
  return $(this).each(function() {
    new CarouselList(this, opts);
  });
};