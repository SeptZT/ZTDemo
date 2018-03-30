class Graph {
  /**
   * params = {
   *  必传参数
   *  data: Array, 必传字段，数据（格式参考echarts关系图）
   *  links: Array, 必传字段，关系（格式参考echarts关系图）
   *  categories: Array, 必传字段，数据分类（格式参考echarts关系图）
   *  可选参数
   *  color: Array, 分类颜色（格式参考echarts关系图）
   *  toolNodeList: Array, 节点右键操作菜单 数据
   *  toolLineList: Array, 线段右键操作菜单 数据
   *  beforeSetOption: Function, // 绘制关系图之前调用，接收参数option
   *  clickTool: Function // 点击操作框之后调用
   * }
   */
  constructor(chart, params = {}) {
    this.DEFAULTS = {
      toolNodeList: [],
      toolLineList: []
    }
    this.chart = chart
    this.params = Object.assign({}, this.DEFAULTS, params)
    this._init()
  }
  _init() {
    this.lastIndex = 0 // 上一次操作节点的索引，用于取消一下选中样式
    this.nowNode = {} // 当前操作节点
    this.toolHtml = {} // 操作框
    this.pDom = this.chart._dom.parentNode
    this.toolBox = this.pDom.querySelector('.tool-box')
    this._draw()
    this._chartResize()
    this._createToolList(this.params.toolNodeList, 'node')  // 绘制节点右键操作框
    this._createToolList(this.params.toolLineList, 'line')  // 绘制连线右键操作框
    this._listHover()
    this._toolItemClick()
    this._chartClick() // 点击节点或线显示操作框
    this._preventMouseActive() // 阻止鼠标右键默认行为
    this._clickWindowCloseTool()
  }
  _draw() {
    let option = this._getOption()
    if (this.chart._chartsViews.length) {
      let symbolPoints = this.chart._chartsViews[0]._symbolDraw._data
        ._itemLayouts
      this._dealDataPoints(symbolPoints)
    }
    if (this.params.beforeSetOption) {
      this.params.beforeSetOption(option)
    }
    this.chart.setOption(option)
  }
  _addNewNodes(newNodes, newLinks) {
    if (this.newLinks && this.newLinks.length) {
      this._cancelOtherLinksMark()
    }
    this.newLinks = newLinks
    this.params.data = this.params.data.concat(newNodes)
    this.params.links = this.params.links.concat(newLinks)
    this._setNewLinksMark()
    this._setNowNodeMark()
    this._draw()
  }
  _setNowNodeMark() {
    this.params.data[this.lastIndex].label = {}
    this.params.data[this.nowNode.dataIndex].label = {
      normal: {
        fontSize: 12,
        color: '#fff',
        backgroundColor: '#d86653',
        padding: [3, 5]
      }
    }
  }
  _setNewLinksMark() {
    this.newLinks.forEach(x => {
      x.lineStyle = {
        normal: {
          shadowColor: 'red',
          shadowBlur: 5
        }
      }
      x.label = {
        normal: {
          show: true,
          formatter: 'new',
          color: 'red',
          fontWeight: 'bolder'
        }
      }
    })
  }
  _cancelOtherLinksMark() {
    this.newLinks.forEach(o => {
      o.lineStyle = {}
      o.label = {}
    })
  }
  /**
   * 固定已有点坐标
   */
  _dealDataPoints(symbolPoints) {
    symbolPoints.forEach((x, i) => {
      let data = this.params.data[i]
      data.x = x[0]
      data.y = x[1]
      data.fixed = true
    })
  }
  _getOption() {
    let option = {
      progressive: 0,
      series: [
        {
          type: 'graph',
          layout: 'force',
          force: {
            repulsion: 500,
            gravity: 0.1,
            layoutAnimation: false
          },
          animation: false,
          symbolSize: 20,
          focusNodeAdjacency: true,
          roam: true,
          categories: this.params.categories,
          data: this.params.data,
          links: this.params.links,
          label: {
            normal: {
              position: 'top',
              fontSize: 12,
              show: true
            }
          },
          edgeSymbol: ['circle', 'arrow'],
          edgeSymbolSize: [0, 10],
          lineStyle: {
            normal: {
              color: 'source',
              opacity: 0.5,
              width: 2,
              curveness: 0
            },
            emphasis: {
              width: 4,
              opacity: 1
            }
          }
        }
      ]
    }
    if (this.params.color) {
      option.color = this.params.color
    }
    console.log(option)
    return option
  }
  _chartClick() {
    this.chart.on('mouseup', params => {
      let e = params.event
      let type = e.which
      let dataType = params.dataType
      this.lastIndex = this.nowNode.dataIndex || 0
      this.nowNode = params
      if (type !== 3) {
        return
      }
      this.toolBox.style.left = e.offsetX + 'px'
      this.toolBox.style.top = e.offsetY + 'px'
      if (dataType === 'node') {
        // 点击节点
        this._toolShow('node')
        this._toolHide('line')
      } else if (dataType === 'edge') {
        // 点击线
        this._toolShow('line')
        this._toolHide('node')
      }
    })
  }
  _createToolList(list, type) {
    this.toolHtml[type] = []
    this._getToolHtml(list, type)
    let newNode = document.createElement('ul')
    newNode.className = type + ' hide'
    newNode.innerHTML = this.toolHtml[type].join('')
    this.toolBox.appendChild(newNode)
  }
  _getToolHtml(list, type) {
    let arr = this.toolHtml[type]
    list.forEach(x => {
      if (x.children && x.children.length > 0) {
        arr.push(`<li class="pNode">${x.label}<span> &gt;</span>`)
        arr.push('<ul class="children hide">')
        this._getToolHtml(x.children, type)
        arr.push('</li></ul>')
      } else {
        arr.push(`<li name=${x.name}>${x.label}</li>`)
      }
    })
  }
  _toolItemClick() {
    this.toolBox.addEventListener('click', e => {
      e = e || window.event
      let tag = e.target
      if (tag.className === 'pNode') {
        return
      }
      this._toolHide()
      if (this.params.clickTool) {
        let name = tag.getAttribute('name')
        this.params.clickTool(name, this.nowNode)
      }
    })
  }
  _toolHide(type) {
    this._setToolDisplay('none', type)
  }
  _toolShow(type) {
    this._setToolDisplay('block', type)
  }
  _setToolDisplay(val, type) {
    if (type) {
      this.toolBox.querySelector('.' + type).style.display = val
      return
    }
    if (this.toolBox.querySelector('.line')) {
      this.toolBox.querySelector('.line').style.display = val
    }
    if (this.toolBox.querySelector('.node')) {
      this.toolBox.querySelector('.node').style.display = val
    }
  }
  _listHover() {
    this.toolBox.querySelectorAll('li.pNode').forEach(x => {
      let o = x.querySelector('ul')
      x.onmouseenter = () => {
        o.className = 'children'
      }
      x.onmouseleave = () => {
        o.className = 'children hide'
      }
    })
  }
  _preventMouseActive() {
    this.pDom.addEventListener('contextmenu', e => {
      e = e || window.event
      e.preventDefault()
      return false
    })
  }
  _chartResize() {
    window.addEventListener('resize', () => {
      this.chart.resize()
      this._toolHide()
    })
  }
  _clickWindowCloseTool() {
    window.addEventListener('click', e => {
      this._toolHide()
    })
    this.pDom.addEventListener('click', e => {
      e = e || window.event
      e.stopPropagation()
    })
  }
}

// export const drawGraph = function(chartDom, params) {
//   return new Graph(chartDom, params)
// }
