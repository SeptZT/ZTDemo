zeroToNum();
function zeroToNum(param) {
  if (!param) {
    param = {
      time: 300,
      selector: 'body'
    }
  } else {
    if (!param.selector) {
      param.selector = 'body';
    }
    if (!param.time) {
      param.time = 300;
    }
  }
  var $eles = $(param.selector).find('[toNum]');

  $eles.each(function(i) {
    var ele = $eles[i];
    var num = ele.getAttribute('toNum');

    if (num && !isNaN(num) && num > 0) {
      toNum(ele, num, param.time);
    }
  });
}

function toNum(dom, num, totalTime) {
  var i = 1, // 写入容器的数字
      time, // 定时器调用时间
      addnum; // 每次递增的数字

  // 给容器一个初值
  dom.innerText = i;

  if (num < totalTime) {
    time = totalTime / num;
    addnum = 1;
  } else {
    time = 10;
    addnum = Math.floor(num / totalTime) * time;
  }

  // 定义timer定时器
  var timer = setInterval(function() {
    // 若i+addnum大于num，调整每次递增的数字
    if(addnum > 1 && i + addnum >= num) {
      addnum = Math.floor((num - i) / totalTime) > 1 ? Math.floor((num - i) / totalTime) : 1;
      console.log(1111111111, addnum);
    }
    console.log(i, addnum);
    i = i + addnum;
    dom.innerText = i;

    if(i >= num) {
      clearInterval(timer);
    }
  }, time);
}
