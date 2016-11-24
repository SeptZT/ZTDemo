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

//=====================

/**
 * 阻止默认行为
 * */
function preventDefault(event){  //函数传值的目的是为了兼容火狐
  var e = event || window.event;  //兼容IE
  if (e.preventDefault){
    e.preventDefault();
  } else {
    e.returnValue = false;
  }
}