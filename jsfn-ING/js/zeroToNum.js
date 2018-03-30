function zeroToNum(params) {
  const DEFAULT = {
    totalTime: 300, // 执行完整个过程所需时间
    maxTime: 100, // 定时器调用间隔时间
    selector: 'body'
  }
  params = Object.assign({}, DEFAULT, params)
  let eles = document.querySelectorAll(params.selector + ' [data-num]')
  eles.forEach(x => {
    let num = x.getAttribute('data-num')
    if (num && !isNaN(num) && num > 0) {
      toNum(x, num, params)
    }
  })
}

function toNum(dom, num, params) {
  let totalTime = params.totalTime
  let i = 1 // 写入容器的数字
  let time // 定时器调用时间
  let addnum // 每次递增的数字

  // 给容器一个初值
  dom.innerText = i

  if (num < totalTime) {
    time = totalTime / num
    addnum = 1
  } else {
    time = 10
    addnum = Math.floor(num / totalTime) * time
  }
  time = time > params.maxTime ? params.maxTime : time
  // 定义timer定时器
  let timer = setInterval(function() {
    // 若i+addnum大于num，调整每次递增的数字
    if (addnum > 1 && i + addnum >= num) {
      addnum =
        Math.floor((num - i) / totalTime) > 1
          ? Math.floor((num - i) / totalTime)
          : 1
    }
    i += addnum
    dom.innerText = i
    if (i >= num) {
      clearInterval(timer)
    }
  }, time)
}

zeroToNum()
// export default zeroToNum
