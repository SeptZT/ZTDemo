
function Page(ele, totalPage, handle) {
  this.obj = $(ele);
  this.handle = handle;

  this.nowPage = 1; // 当前选中页
  this.pageCount = 10;  // 显示页码的数量：1到10

  this._init(Math.ceil(totalPage)); // 传入总页数(向上取整，避免传入的数是小数)
}

/* *
 * 生成页码
 * */
Page.prototype._init = function(total) {
  var startNum, endNum,
      startClass = "",  // 上一页、第一页的样式
      endClass = "",  // 下一页、最后一页的样式
      tmp = total - this.nowPage,
      html = [];
  
  // 判断页码显示的起始数字startNum和结束数字startNum
  if(total <= this.pageCount) {
    startNum = 1;
    endNum = total;
  } else if(tmp >= this.pageCount) {
    startNum = this.nowPage;
    endNum = this.nowPage + this.pageCount - 1;
  } else {
    startNum = this.nowPage - (this.pageCount - 1 - tmp);
    endNum = total;
  }

  if(this.nowPage === 1) {
    startClass = "page-disabled";
  } else if(this.nowPage === total) {
    endClass = "page-disabled";
  }

  html.push("<a class='" + startClass + "' href='javascript:void(0);' title='第一页' index='page-first'>&lt;&lt;</a>");
  html.push("<a class='" + startClass + "' href='javascript:void(0);' title='上一页' index='page-prev'>&lt;</a>");

  for(var i = startNum; i <= endNum; i++) {
    html.push("<a class='" + (this.nowPage === i ? "page-selected" : "") + "' href='javascript:void(0);' index='" + i + "'>" + i + "</a>");
  }

  html.push("<a class='" + endClass + "' href='javascript:void(0);' title='下一页' index='page-next'>&gt;</a>");
  html.push("<a class='" + endClass + "' href='javascript:void(0);' title='最后一页' index='page-last''>&gt;&gt;</a>");
  html.push("<input class='page-input' type='text'/><button>搜索</button><span>" + total + "页</span>");

  this.obj.html(html.join(""));

  this._bind();
  this._enter();
  this._goTo(total);
  
};

/* *
 * 绑定点击事件
 * */
Page.prototype._bind = function() {
  var _this = this,
    handle = this.handle;

  if(!handle || typeof handle !== "function") {
    console.warn("no callback bind to pagination！");
    return;
  }
  this.obj.off("click").on("click", function(e) {
    var e = e || window.event,
      target = e.target,
      index = $(target).attr("index"),
      className = target.className;

    if(target.tagName === "BUTTON") {
      _this._goTo(target, handle);
    }

    if(target.tagName !== "A" || className === "selected" || className === "page-disabled") {
      return;
    }

    // 上一页
    if(index == "prev") {
      if(_this.nowPage === 1) {
        return;
      }
      handle(--_this.nowPage);
      return;
    }
    // 下一页
    if(index == "page-next") {
      if(_this.nowPage == _this.pageCount) {
        return;
      }
      handle(++_this.nowPage);
      return;
    }
    // 第一页
    if(index == "page-first") {
      handle(_this.nowPage = 1);
      return;
    }
    // 最后一页
    if(index == "page-last") {
      handle(_this.nowPage = _this.pageCount);
      return;
    }
    
    // 数字翻页
    handle(_this.nowPage = parseInt(index));
  });
};

/* *
 * 搜索
 * */
Page.prototype._goTo = function(total) {
  var obj = this.obj,
      _this = this;
  obj.find('button').on('click', function(){
    var val = $('.page-input').val();

    if(isNaN(val) || val < 1 || val > total || !(/^\d+$/.test(val))) {
      obj.append('<span class="err_tip">输入有误</span>');
      setTimeout(function() {
        obj.find('.err_tip').fadeOut();
      }, 1500);
  
      obj.find('.page-input').val("");
      return;
    }
  
    _this.handle(_this.nowPage = parseInt(val));
  });
};

/* *
 * 监听回车
 * */
Page.prototype._enter = function() {
  var _this = this;
  $(this).find('.page-input').on("keyup", function(e) {
    var e = e || window.event;
    if(e.keyCode == 13) {
      _this._goTo();
    }
  });
};


;+function($) {
  $.fn.extend({
    /* *
     * 调用方法:
     * $ele.pageInit(totalPage, handle);
     *
     * 参数说明:
     * @param   totalPage [总页数]
     * @param   handle    [回调函数多为获取翻页数据的方法]
     */
    pageInit: function(totalPage, handle) {
      if(!totalPage) {
        $(this).html("");
      } else {
        new Page(this, totalPage, handle);
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
     */
    pageRest: function() {
      this.nowPage = 1;
      return this;
    }
  })
}(jQuery);