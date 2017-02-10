function Bar(obj, opts){
  this.DEFAULTS = { //默认参数
    "num": 0,
    "isDrag": true,
    "dragEle": document
  }
  this.opts = $.extend({}, this.DEFAULTS, opts);

  this.bar = $(obj);  // 进度条的容器
  this._createBar();  // 生成进度条
  this.drag = this.bar.find('.progress-drag'); // 可以拖动的按钮
  this._setStyle(); // 进度条样式初始化
  this._progressBar(this.opts.num);
  this._dragBar();  // 进度条拖动
}

/* *
 * 生成进度条
 * */
Bar.prototype._createBar = function(){
  var html = '<div class="progress-percent">0</div>'+
              '<div class="progress-rate"></div>';
  if (this.bar.find('.progress-drag').length == 0){
    html += '<span class="progress-drag drag"></span>';
  }
  this.bar.append(html);
}

/* *
 * 样式初始化
 * */
Bar.prototype._setStyle = function(){
  var bar_h = this.bar.height();
  this.drag.css('top', bar_h / 2);
}

/* *
 * 绘制进度条
 * */
Bar.prototype._progressBar = function(num){
  if (!num || num <= 0) {
    num = 0;
  } else if (num >= 1) {
    num = 1;
  } else {
    num = num.toFixed(2);
  }
  var left = this.bar.width() * num + 'px'; // 进度条按钮距左侧的距离  = 进度条的长度 * 百分比
  this.bar.find('.progress-percent').html(parseInt(num*100)+ '%');  // 显示百分比
  this.bar.find('.progress-rate').css('width', left); // 有颜色部分的长度
  this.drag.css('left', left);  // 按钮的位置
}

/* *
 * 实现进度条可拖拽功能
 * */
Bar.prototype._dragBar = function(){
  var _this = this,
      ele = this.opts.dragEle;
  _this.drag.on('mousedown', function(e){
    ele.onmousemove = function(e){
      if (_this.opts.isDrag != false){
        var e = e || window.event,
            pro_bar = e.clientX - _this.bar[0].offsetLeft,  // 获取按钮距进度条最左边的距离
            num = pro_bar / _this.bar.width(); // 计算百分比, 结果是小数形式

        $(this).css('left', pro_bar);
        _this._progressBar(num);  // 根据百分比绘制进度条
      }
    }
    ele.onmouseleave = function(){
      ele.onmousemove=null;
    }
    ele.onmouseup = function(){
      ele.onmousemove=null;
    }
  })
}


;(function($){
  $.fn.extend({
    dragBar: function(opts){
      new Bar(this, opts);
      return this;
    }
  })
})(jQuery)

/* *
 * 调用方法:
 * $(ele).dragBar(opts);
 * html页面需要一个class="progress-bar"的容器. 如<div class="progress-bar"></div>;
 * 若要自定义进度条图标，在容器中定义class="progress-drag"的元素, 即<div class="progress-bar"><span class="progress-drag"></span></div>
 * 参数说明：
 * opts：可选，是一个json对象
 * opts = {
 *   num: 0,
 *   isDrag: true,
 *   dragEle: document
 * } *
 * num: 可选，进度条的百分比，传入小数。默认为0
 * isDrag: 可选，默认是true(可以拖拽)。false: 不可拖拽
 * dragEle: 可选，鼠标移动时，进度条跟着移动的容器,js对象(不是jquery对象). 默认document
 * */
