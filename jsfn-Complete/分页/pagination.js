/**
 * 参数说明:
 *  param = {
 *   'selector': '#page',  // 分页容器
 *   'pagesize': 5,   // 每页显示的条数
 *   'pageCount': 8,  // 最多显示的翻页数字按钮, 缺省值为10
 *   'nowPage': 1 // 当前选中页， 缺省值为1
 *  }
 *
 *  handle    [回调函数：获取翻页数据的方法]
 */
function Page(param, handle) {
  this.obj = $(param.selector)
  this.pagesize = parseInt(param.pagesize, 10)
  this.handle = handle // 回调函数
  this.pageCount = 10 // 设置显示页码的数量
  this.nowPage = 1 // 设置当前选中页

  if (param.pageCount) {
    this.pageCount = parseInt(param.pageCount, 10)
  }
  if (param.nowPage) {
    this.nowPage = parseInt(param.nowPage, 10)
  }
  if (handle && typeof handle === 'function') {
    this._bindEvent()
  }
}

/* *
 * 生成页码
 * 参数说明：total  数据总条数
 * */
Page.prototype._init = function(total, pagesize) {
  var startNum, endNum
  var startClass = '' // 上一页、第一页的样式
  var endClass = '' // 下一页、最后一页的样式
  var html = []
  var i = 0

  if (!total || total === 0) {
    this.obj.html('')
    return
  }

  this.pagesize = pagesize || this.pagesize

  this.totalPage = Math.ceil(total / this.pagesize)

  if (this.nowPage > this.totalPage) {
    this.nowPage = this.totalPage
    this.handle(this.totalPage)
    return
  }

  // 计算页码显示的起始数字startNum和结束数字startNum
  if (this.totalPage <= this.pageCount) {
    startNum = 1
    endNum = this.totalPage
  } else if (this.totalPage - this.nowPage >= this.pageCount) {
    startNum = this.nowPage
    endNum = this.nowPage + this.pageCount - 1
  } else {
    startNum = this.totalPage - this.pageCount + 1
    endNum = this.totalPage
  }

  if (this.nowPage === 1) {
    startClass = ' zt-page-disabled'
  }
  if (this.nowPage === this.totalPage) {
    endClass = ' zt-page-disabled'
  }

  html.push(
    '<li class="zt-page-change' +
      startClass +
      '" title="第一页" index="zt-page-first">&lt;&lt;</li>'
  )
  html.push(
    '<li class="zt-page-change' +
      startClass +
      '" title="上一页" index="zt-page-prev">&lt;</li>'
  )

  for (i = startNum; i <= endNum; i++) {
    html.push(
      '<li class="zt-page-num' +
        (this.nowPage === i ? ' zt-page-selected' : '') +
        '" index="' +
        i +
        '">' +
        i +
        '</li>'
    )
  }

  html.push(
    '<li class="zt-page-change' +
      endClass +
      '" title="下一页" index="zt-page-next">&gt;</li>'
  )
  html.push(
    '<li class="zt-page-change' +
      endClass +
      '" title="最后一页" index="zt-page-last">&gt;&gt;</li>'
  )
  html.push(
    '<li class="zt-page-search"><input placeholder="搜索"/><button>搜索</button><span>共' +
      this.totalPage +
      '页' +
      total +
      '条</span></li>'
  )

  this.obj.html('<ul class="zt-pagination">' + html.join('') + '</ul>')

  this._enter()
}

Page.prototype._bindEvent = function() {
  this.obj.off('click').on(
    'click',
    function(e) {
      e = e || window.event
      var ele = e.target
      var nodeName = e.target.nodeName
      switch (nodeName) {
        case 'LI':
          if ($(ele).hasClass('zt-page-num')) {
            this._clickNum(ele)
          } else if ($(ele).hasClass('zt-page-change')) {
            this._clickChange(ele)
          }
          break
        case 'BUTTON':
          this._goTo()
          break
        default:
          break
      }
    }.bind(this)
  )
}

Page.prototype._clickNum = function(ele) {
  if ($(ele).hasClass('zt-page-selected')) {
    return
  }

  this.nowPage = parseInt($(ele).attr('index'), 10)
  this.handle(this.nowPage)
}

Page.prototype._clickChange = function(ele) {
  var index = $(ele).attr('index')

  if ($(ele).hasClass('zt-page-disabled')) {
    return
  }

  switch (index) {
    case 'zt-page-first':
      this.nowPage = 1
      break
    case 'zt-page-prev':
      this.nowPage--
      break
    case 'zt-page-next':
      this.nowPage++
      break
    case 'zt-page-last':
      this.nowPage = this.totalPage
      break
    default:
      break
  }
  this.handle(this.nowPage)
}

Page.prototype._goTo = function() {
  var searchObj = this.obj.find('.zt-page-search')
  var val = searchObj.find('input').val()
  var time = 1500

  if (isNaN(val) || val < 1 || val > this.totalPage || !/^\d+$/.test(val)) {
    searchObj.append('<span class="zt-err-tip">输入有误</span>')
    setTimeout(function() {
      searchObj.find('.zt-err-tip').fadeOut(function() {
        $(this).remove()
      })
    }, time)

    searchObj.find('input').val('')
    return
  }

  this.nowPage = parseInt(val, 10)
  this.handle(this.nowPage)
}

Page.prototype._enter = function() {
  this.obj.find('.zt-page-search input').on(
    'keyup',
    function(e) {
      e = e || window.event
      console.log(111, e.keyCode)
      if (e.keyCode === 13) {
        this._goTo()
      }
    }.bind(this)
  )
}

Page.prototype._reset = function(page) {
  if (page) {
    this.nowPage = page
  } else {
    this.nowPage = 1
  }
}

/* module.exports = function(param, handle) {
  return new Page(param, handle);
};*/
