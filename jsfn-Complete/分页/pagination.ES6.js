class Page {
  constructor(param, handle) {
    this.obj = document.querySelector(param.selector)
    this.pagesize = parseInt(param.pagesize, 10)
    this.handle = handle
    this.pageCount = 10
    this.nowPage = 1

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
  _init(total, pagesize) {
    let startNum, endNum
    let startClass = '' // 上一页、第一页的样式
    let endClass = '' // 下一页、最后一页的样式
    let html = []
    let i = 0

    if (!total || total === 0) {
      this.obj.innerHTML = ''
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
      `<li class="zt-page-change${startClass}" title="第一页" index="zt-page-first">&lt;&lt;</li>`
    )
    html.push(
      `<li class="zt-page-change${startClass}" title="上一页" index="zt-page-prev">&lt;</li>`
    )

    for (i = startNum; i <= endNum; i++) {
      html.push(
        `<li class="zt-page-num${this.nowPage === i
          ? ' zt-page-selected'
          : ''}" index="${i}">${i}</li>`
      )
    }

    html.push(
      `<li class="zt-page-change${endClass}" title="下一页" index="zt-page-next">&gt;</li>`
    )
    html.push(
      `<li class="zt-page-change${endClass}" title="最后一页" index="zt-page-last">&gt;&gt;</li>`
    )
    html.push(
      `<li class="zt-page-search"><input placeholder="搜索"/><button>搜索</button><span>共${this
        .totalPage}页${total}条</span><span class="zt-err-tip"></span></li>`
    )

    this.obj.innerHTML = `<ul class="zt-pagination">${html.join('')}</ul>`

    this._enter()
  }

  _bindEvent() {
    this.obj.addEventListener('click', e => {
      e = e || window.event
      let ele = e.target
      let nodeName = e.target.nodeName
      let className = ele.className

      switch (nodeName) {
        case 'LI':
          if (/\bzt-page-num\b/.test(className)) {
            this._clickNum(ele)
          } else if (/\bzt-page-change\b/.test(className)) {
            this._clickChange(ele)
          }
          break
        case 'BUTTON':
          this._goTo()
          break
        default:
          break
      }
    })
  }

  _clickNum(ele) {
    let className = ele.className
    if (/\bzt-page-selected\b/.test(className)) {
      return
    }

    this.nowPage = parseInt(ele.getAttribute('index'), 10)
    this.handle(this.nowPage)
  }

  _clickChange(ele) {
    let index = ele.getAttribute('index')
    let className = ele.className

    if (/\bzt-page-disabled\b/.test(className)) {
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

  _goTo() {
    let search_obj = this.obj.querySelector('.zt-page-search')
    let val = search_obj.querySelector('input').value
    let time = 1500

    if (isNaN(val) || val < 1 || val > this.totalPage || !/^\d+$/.test(val)) {
      let errObj = document.querySelector('.zt-err-tip')
      errObj.innerText = '输入有误'
      setTimeout(function() {
        errObj.innerText = ''
      }, time)

      search_obj.querySelector('input').value = ''
      return
    }

    this.nowPage = parseInt(val, 10)
    this.handle(this.nowPage)
  }

  _enter() {
    this.obj.querySelector('.zt-page-search input').addEventListener(
      'keyup',
      function(e) {
        e = e || window.event
        if (e.keyCode === 13) {
          this._goTo()
        }
      }.bind(this)
    )
  }

  _reset(page) {
    if (page) {
      this.nowPage = page
    } else {
      this.nowPage = 1
    }
  }
}

//if (module && module.exports) {
//module.exports = function(param, handle) {
//  return new Page(param, handle);
//};
//}

/* *
 * 参数说明:
 *  param = {
 *   'selector': '#page',  // 分页容器
 *   'pagesize': 5,   // 每个页面显示的内容的条数
 *   'pageCount': 8,  // 最多显示的翻页数字按钮, 缺省值为10
 *   'nowPage': 1 // 当前选中页， 缺省值为1
 *  }
 *
 *  handle    [回调函数：获取翻页数据的方法]
 *
 * 调用_init方法获得分页样式
 * */
