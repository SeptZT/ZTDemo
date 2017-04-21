class Page {
  constructor(param, handle) {
    this.obj = $(param.selector);
    this.pageSize = parseInt(param.pageSize, 10);
    this.handle = handle;
    this.pageCount = 10;
    this.nowPage = 1;

    if(param.pageCount) {
      this.pageCount = parseInt(param.pageCount, 10);
    }
    if(param.nowPage) {
      this.nowPage = parseInt(param.nowPage, 10);
    }
  }

  /* *
   * 生成页码
   * 参数说明：total  数据总条数
   * */
  _init(total) {
    let startNum, endNum;
    let startClass = ''; // 上一页、第一页的样式
    let endClass = ''; // 下一页、最后一页的样式
    let html = [];
    let i = 0;

    if(!total || total === 0) {
      this.obj.html('');
      return;
    }

    this.totalPage = Math.ceil(total / this.pageSize);

    if(this.nowPage > this.totalPage) {
      this.nowPage = this.totalPage;
      this.handle(this.totalPage);
      return;
    }

    // 计算页码显示的起始数字startNum和结束数字startNum
    if(this.totalPage <= this.pageCount) {
      startNum = 1;
      endNum = this.totalPage;
    } else if(this.totalPage - this.nowPage >= this.pageCount) {
      startNum = this.nowPage;
      endNum = this.nowPage + this.pageCount - 1;
    } else {
      startNum = this.totalPage - this.pageCount + 1;
      endNum = this.totalPage;
    }

    if(this.nowPage === 1) {
      startClass = ' page-disabled';
    }
    if(this.nowPage === this.totalPage) {
      endClass = ' page-disabled';
    }

    html.push('<li class="page-change' + startClass + '" title="第一页" index="page-first">&lt;&lt;</li>');
    html.push('<li class="page-change' + startClass + '" title="上一页" index="page-prev">&lt;</li>');

    for(i = startNum; i <= endNum; i++) {
      html.push('<li class="page-num ' + (this.nowPage === i ? 'page-selected' : '') + '" index="' + i + '">' + i + '</li>');
    }

    html.push('<li class="page-change' + endClass + '" title="下一页" index="page-next">&gt;</li>');
    html.push('<li class="page-change' + endClass + '" title="最后一页" index="page-last">&gt;&gt;</li>');
    html.push('<li class="page-search"><input placeholder="搜索"/><button>搜索</button><span>共' + this.totalPage + '页' + total + '条</span></li>');

    this.obj.html('<ul class="pagination">' + html.join('') + '</ul>');

    this._bind();
    this._enter();
  };

  /* *
   * 绑定点击事件
   * */
  _bind() {
    let _this = this;
    let handle = this.handle;

    if(!handle || typeof handle !== 'function') {
      return;
    }

    // 点击搜索
    this.obj.find('button').off('click').on('click', () => _goTo());

    // 点击数字翻页
    this.obj.find('.page-num').off('click').on('click', function() {
      if($(this).hasClass('page-selected')) {
        return;
      }

      _this.nowPage = parseInt($(this).attr('index'), 10);
      handle(_this.nowPage);
    });

    // 点击切换上一页、下一页、第一页、最后一页
    this.obj.find('.page-change').off('click').on('click', function() {
      let index = $(this).attr('index');

      if($(this).hasClass('page-disabled')) {
        return;
      }

      switch(index) {
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
          _this.nowPage = _this.totalPage;
          break;
        default:
          break;
      }
      handle(_this.nowPage);
    });
  };

  /* *
   * 搜索
   * */
  _goTo() {
    let search_obj = this.obj.find('.page-search');
    let val = search_obj.find('input').val();
    let time = 1500;

    if(isNaN(val) || val < 1 || val > this.totalPage || !/^\d+$/.test(val)) {
      search_obj.append('<span class="err_tip">输入有误</span>');
      setTimeout(function() {
        search_obj.find('.err_tip').fadeOut(function() {
          $(this).remove();
        });
      }, time);

      search_obj.find('input').val('');
      return;
    }

    this.nowPage = parseInt(val, 10);
    this.handle(this.nowPage);
  };

  /* *
   * 监听回车
   * */
  _enter() {
    this.obj.find('.page-search input').on('keyup', function(e) {
      let enterCode = 13; // 回车

      e = e || window.event;
      if(e.keyCode === enterCode) {
        this._goTo();
      }
    }.bind(this));
  };
}

$.fn.pagination = function(param, handle) {
  param.selector = this;
  return new Page(param, handle);
};

if (module && module.exports) {
  module.exports = function(param, handle) {
    return new Page(param, handle);
  };
}

/* *
 * 参数说明:
 *  param = {
 *   'selector': '#page',  // 分页容器
 *   'pageSize': 5,   // 每个页面显示的内容的条数
 *   'pageCount': 8,  // 最多显示的翻页数字按钮, 缺省值为10
 *   'nowPage': 1 // 当前选中页， 缺省值为1
 *  }
 *
 *  handle    [回调函数：获取翻页数据的方法]
 *
 * 调用_init方法获得分页样式
 * */