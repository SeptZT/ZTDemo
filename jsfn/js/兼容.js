"use strict";

//=====================

/**
 * 阻止冒泡
 * */
function stopPropagation(event){  //函数传值的目的是为了兼容火狐
  var e = event || window.event;  //兼容IE
  if (e.stopPropagation){
    e.stopPropagation();
  } else {
    e.cancelBubble = true;
  }
}