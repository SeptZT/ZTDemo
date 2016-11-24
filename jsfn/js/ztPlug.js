"use strict";

//==============================

/**
 * jQuery对象的扩展方法
 * */
+function($) {
  /**
   * 常用小功能：
   * 1、数字递增
   * 2、监听回车
   * 3、 点击空白处指定框消失
   * */
  $.fn.extend({

    //数字num，从0递增到num
    zeroToNum: function(num) {
      //判断传入的变量是否存在、是否为数字；
      if (!num || (num && typeof(num) != "number") || num.toString().length > 15){
        console.log("请传入正确的数字");
        return false;
      }

      var _this = this,
          i = 0,  //写入容器的数字
          time = 1, //定时器调用时间
          addnum = Math.floor(num / 500) > 1 ? Math.floor(num / 500) : 1; //通过调整每次递增的数字来调整速度

      //给容器一个初值
      $(_this).text(i);

      //通过调整时间来控制速度
      if (num < 500 && num > 8){
        time = 1000 / num;
      } else if (num <= 8){
        time = 1000 / 8;
      }

      //定义timer定时器
      var timer = setInterval(function(){

        //若i+addnum大于num，调整每次递增的数字
        if (addnum > 1 && i + addnum >= num){
          addnum = Math.floor((num - i) / 10) > 1 ? Math.floor((num - i) / 10) : 1;
        }
        i = i + addnum;
        $(_this).text(i);

        if (i >= num) {
          clearInterval(timer);
          return false;
        }
      }, time);

      return this;
    },

    //监听回车
    onEnter: function(obj){
      var _this = this;

      _this.on('keyup', function(event){
        var e = event || window.event;  //兼容IE
        if (e && e.keyCode == 13){  // enter 键
          obj.click();
        }
      });

      return this;
    },

    //点击空白处，指定框消失
    hideDropBox: function(){
      var _this = this;
      $(_this).off('click').on('click', function(e){
        e.stopPropagation();
      });
      $('body').off('click').on('click', function(){
        _this.hide();
      });
    }
  });


  //====================

  /**
   * 表单：
   * 1、正则验证
   * */
  $.fn.extend({
    //表单验证
    formChecked: function(){
      var _this = this,
          checked = true,
          pattern = {
            "require": /\S/,  //非空
            "number": /^\d+$/,  //整数
            "email": /^([\w\.\-]+)@([\w\.\_]+)\.([\w]{2,4})$/,  //邮箱
            "ip": /^((25[0-5]|2[0-4]\d|[01]?\d\d?)($|(?!\.$)\.)){4}$/,  //IP
            "port": /^(\d|[1-9]\d{1,3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/, //端口号
            "domain": / ^(?=^.{3,255}$)[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$/, //域名
          };

      _this.find("[checked-type]").each(function(){
        var text = this.value ? this.value : this.innerText,
            _type = $(this).attr("checked-type");

        if (_type != ""){
          var _typearr = _type.split(" ");

          for (var i=0, len=_typearr.length; i<len; i++){
            if (!pattern[_typearr[i]]){
              console.log("暂不支持 checked-type =", _typearr[i], " 的验证");
              continue;
            } else if (!pattern[_typearr[i]].test(text)){
              checked = false;
              break;
            }
          }
        }
      });

      return checked;
    }
  });
}(jQuery);

//==============================
/**
 * 模态框
 * */
+function(){
  $.fn.extend({
    modal: function(options){
      var _this = this;
      switch (options){
        case "show":  //显示模态框
          //模态框定位
          var left = ($(window).width() - (_this).width()) / 2,
              top = ($(window).height() - (_this).height()) / 3;
          $(_this).css({
            "left": left,
            "top": top
          }).fadeIn();

          //点击关闭模态框
          $(_this).find(".modal-close, .modal-cancel").off("click").on("click", function(){
            $(_this).modal("hide");
          });

          break;

        case "hide":  //隐藏模态框
          $(_this).fadeOut();

          break;

        default:
          console.error("modal参数错误");
      }

      return this;
    }
  });

}(jQuery);

//==============================

/**
 * 数组的扩展方法
 * */
+function($){
  //删除数组的指定元素
  if (!Array.prototype.delItem){
    Array.prototype.delItem = function(item, isAll){  //item：待删除的元素; isAll：是否删除数组中所有的指定元素，默认是true
      var _this = [].concat(this),
          isAll;

      if (isAll == false){
        isAll = false;
      } else {
        isAll = true;
      }
      for (var i=0, len=_this.length; i<len; i++){
        if (_this[i] == item){
          _this.splice(i, 1);
          if (isAll == false){
            break;
          }
        }
      }
      console.log(isAll)
      return _this;
    }
  }

}(jQuery);

//==============================

/**
 * 常用js兼容方法：
 * 1、阻止冒泡
 * 2、阻止默认行为
 * */
var zt = {

  /**
   * 阻止冒泡
   * */
  stopPropagation: function(event){ //函数传值的目的是为了兼容火狐
    var e = event || window.event;  //兼容IE
    if (e.stopPropagation){
      e.stopPropagation();
    } else {
      e.cancelBubble = true;
    }
  },

  /**
   * 阻止默认行为
   * */
  preventDefault: function(event){  //函数传值的目的是为了兼容火狐
    var e = event || window.event;  //兼容IE
    if (e.preventDefault){
      e.preventDefault();
    } else {
      e.returnValue = false;
    }
  }
}
