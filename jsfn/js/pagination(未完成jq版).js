function Page(ele, opts, handle) {
  this.obj = $(ele);
  this.handle = handle;
  this.pageCount = 10;  // 设置显示页码的数量
  this.nowPage = 1; // 设置当前选中页

  if (!isNaN(opts)) {
    this.total = opts;  // 总页数
  } else if (typeof opts === 'object') {
    this.total = opts.total;
    if (opts.pageCount) {
      this.pageCount = opts.pageCount;
    }
    if (opts.nowPage && !isNaN(opts.nowPage) && opts.nowPage > 0 && opts.nowPage <= opts.total) {
      this.nowPage = parseInt(opts.nowPage, 10);
    }
  }

  this._init();
}

/* *
 * 生成页码
 * */
Page.prototype._init = function() {
  var startNum, endNum;
  var total = this.total;
  var totalPage = Math.ceil(total / this.pageCount);  // 总页数(向上取整，避免传入的数是小数)
  var startClass = '';  // 上一页、第一页的样式
  var endClass = '';  // 下一页、最后一页的样式
  var tmp = total - this.nowPage;
  var html = [];
  var i = 0;

  // 判断页码显示的起始数字startNum和结束数字startNum
  if (total <= this.pageCount) {
    startNum = 1;
    endNum = total;
  } else if (tmp >= this.pageCount) {
    startNum = this.nowPage;
    endNum = this.nowPage + this.pageCount - 1;
  } else {
    startNum = this.nowPage - (this.pageCount - 1 - tmp);
    endNum = total;
  }

  if (this.nowPage === 1) {
    startClass = ' page-disabled';
  }
  if (this.nowPage === total) {
    endClass = ' page-disabled';
  }

  html.push('<li class="page-change' + startClass + '" title="第一页" index="page-first">&lt;&lt;</li>');
  html.push('<li class="page-change' + startClass + '" title="上一页" index="page-prev">&lt;</li>');

  for (i = startNum; i <= endNum; i++) {
    html.push('<li class="page-num ' + (this.nowPage === i ? 'page-selected' : '') + '" index="' + i + '">' + i + '</li>');
  }

  html.push('<li class="page-change' + endClass + '" title="下一页" index="page-next">&gt;</li>');
  html.push('<li class="page-change' + endClass + '" title="最后一页" index="page-last">&gt;&gt;</li>');
  html.push('<li class="page-search"><input placeholder="搜索"/><button>搜索</button><span>共' + totalPage + '页' + total + '条</span></li>');

  this.obj.html('<ul class="pagination">' + html.join('') + '</ul>');

  this._bind();
  this._goTo();
  this._enter();
};

/* *
 * 绑定点击事件
 * */
Page.prototype._bind = function() {
  var _this = this;
  var handle = this.handle;

  if (!handle || typeof handle !== 'function') {
//  console.warn('no callback bind to pagination！');
    return;
  }

  // 点击数字翻页
  this.obj.find('.page-num').off('click').on('click', function() {
    if ($(this).hasClass('page-selected')) {
      return;
    }

    _this.nowPage = parseInt($(this).attr('index'), 10);
    handle(_this.nowPage);
    _this._init();
  });

  // 点击切换上一页、下一页、第一页、最后一页
  this.obj.find('.page-change').off('click').on('click', function() {
    var index = $(this).attr('index');

    if ($(this).hasClass('page-disabled')) {
      return;
    }

    switch (index) {
      case 'page-first':
        _this.nowPage = 1;
        break;
      case 'page-prev':
        _this.nowPage--;
        break;
      case 'page-next':
        _this.nowPage++;
        break;
      case 'page-last':
        _this.nowPage = _this.total;
        break;
      default:
        break;
    }
    handle(_this.nowPage);
    _this._init();
  });
};

/* *
 * 点击搜索
 * */
Page.prototype._goTo = function() {
  var obj = this.obj.find('.page-search');
  var _this = this;

  obj.find('button').off('click').on('click', function(){
    var val = obj.find('input').val();
    var time = 1500;

    if (isNaN(val) || val < 1 || val > _this.total || !/^\d+$/.test(val)) {
      obj.append('<span class="err_tip">输入有误</span>');
      setTimeout(function() {
        obj.find('.err_tip').fadeOut();
      }, time);

      obj.find('input').val('');
      return;
    }

    _this.nowPage = parseInt(val, 10);
    _this.handle(_this.nowPage);
    _this._init();
  });
};

/* *
 * 监听回车
 * */
Page.prototype._enter = function() {
  var _this = this;
  $(this).find('.page-search input').on('keyup', function(e) {
    var enterCode = 13; // 回车

    e = e || window.event;
    if (e.keyCode === enterCode) {
      _this._goTo();
    }
  });
};

(function($) {
  $.fn.extend({

    /* *
     * 调用方法:
     * $ele.pageInit(opts, handle);
     *
     * 参数说明:
     * @param   opts 
     *          (1) 可以传number，总条数 
     *          (2) 可以传一个对象{ total: 20, pageCount: 8, nowPage: 5 }
     *                            total表示总条数，
     *                            pageCount表示显示页码的数量，缺省值为10
     *                            nowPage: 选中页，缺省值为1
     * @param   handle    [回调函数为获取翻页数据的方法]
     * */
    pageInit: function(opts, handle) {
      if (!opts || !handle) {
        $(this).html('');
      } else {
        new Page(this, opts, handle);
      }
      return this;
    },

    /* *
     * 调用方法:
     * $ele.pageRest();
     *
     * 说明:
     * 重置this.nowPage  业务逻辑中使用的方法
     * 如果发现业务逻辑无法重置当前页码  请手动调用该方法重置当前页码
     * 多数无法重置的BUG发生在搜索-还原以后
     * */
    pageRest: function() {
      this.nowPage = 1;
      return this;
    }
  });
})(jQuery);
