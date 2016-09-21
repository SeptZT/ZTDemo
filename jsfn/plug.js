/**
 * 1、$.fn
 * 传入jQuery并立即执行， 防止$符号污染。
 * 这里的$只属于这个立即执行函数的函数作用域
 * */
;(function($){
  $.fn.changeColor = function(colorStr){
    this.css("color", colorStr);
    return this;  //返回jQuery对象，实现链式调用
  }
})(jQuery);

/**
 * 2、$.extend和$.fn.extend用来扩展jQuery对象本身
 * （1）$.extend方法是在jQuery全局对象上扩展方法，
 * $.fn.extend方法是在$选择符选择的jQuery对象上扩展方法。
 * 所以扩展jQuery的公共方法一般用$.extend方法，
 * 定义插件一般用$.fn.extend方法。
 * （2）$.extend还有一种用法，合并2个对象
 * var setting = $.extend(defaultSetting, option);
 * 把后面一个对象的属性值赋给第一个对象
 * */
(function($) {
  $.fn.extend({
    changeStyle: function(option) {
      var defaultSetting = {
        colorStr: "green",
        fontSize: 12
      };
      var setting = $.extend(defaultSetting, option);
      this.css("color", setting.colorStr).css("fontSize", setting.fontSize + "px");
      return this;
    }
  });
})(jQuery);




//调用方式$('.box').changeColor('red');
