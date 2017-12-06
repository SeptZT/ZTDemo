/**
 * 注：不支持IE8及其以下的IE浏览器
 * 1、（必须）页面上存在<input name="selection">
 * 2、调用selection.loadSelectionList(data);生成下拉列表
 *    data为数组, 如：data = [1, 2, 3, 4, 5, 6, 7, 8];【可根据需求自行修改函数】
 * 3、调用selection.isCheckedItem();
 *    编辑时， 选中项以英文分号分隔，并以分号结尾  写进<input name="selection" value="1;2;3;">的value中
 *    编辑后，提交表单可直接获取<input name="selection">的value值
 * */

var selection = {
  input_obj: $('input[name=selection]'), //input对象
  input_h: 32,
  box: {},  //selection对象，生成后赋值。即执行createSelection后生成
  _init: function(){
    this.createSelection();
  },
  createSelection: function(){  //生成下拉框
    var input_obj = $('input[name=selection]');

    var sel = '<div class="selection">'+
                '<span class="dropdown"></span>'+ //下拉三角形
                '<div class="checked-list"></div>'+ //已选择列表
                '<ul class="selection-item"></ul>'+ //待选择列表
              '</div>';
    input_obj.after(sel);
    //box对象
    this.box = input_obj.next('.selection');  //selection对象

    //input[name=selection]对象
    this.input_obj = input_obj;

    //input高度
    this.input_h = input_obj.height();

    //selection对象大小调整
    this.box.css({
      "width": input_obj.css('width'),
      "min-height": input_obj.css('height'),
      "line-height": input_obj.css('line-height'),
    });

    //checked-list对象大小调整
    this.box.find('.checked-list').css({
      "min-height": input_obj.css('height'),
    });

    //下拉三角形重新定位
    this.box.find('.dropdown').css({
      "top": input_obj.height() / 2 - 3
    });
    input_obj.hide();

    //注册下拉事件
    this.dropDown();
  },
  dropDown: function(){
    $('.selection .dropdown, .selection .checked-list').off('click').on('click', function(e){
      var _this = $(this).parents('.selection');
      var obj = _this.find('.selection-item');
      var dropdown = _this.find('.dropdown');
      if (obj.css('display') == 'none'){
        obj.slideDown(100);
        dropdown.css({
          'transform': 'rotate(-180deg)',
          'transition': 'transform .3s',
          'transform-origin': '50% 25%'
        });
      } else if(obj.css('display') == 'block'){
        obj.slideUp(100);
        dropdown.css({
          'transform': 'rotate(0)',
          'transition': 'transform .3s',
          'transform-origin': '50% 25%'
        });
      }
    });
  },
  loadSelectionList: function(data){ // data为数组
    var len = data.length;
    var html = "";
    for(var i=0; i<len; i++){
      html += '<li>'+data[i]+'</li>';
    }
    this.box.find('.selection-item').html(html);

    this.addCheckedItem();

    this.closeSectionItem();
  },
  isCheckedItem: function(){  //str选中项以分号分隔
    this.box.find('.checked-list').text('');
    var str = this.input_obj.val();
    var item_arr = str.split(';');
    for (var i=0, len=item_arr.length; i<len; i++){
      this.box.find('li').each(function(){
        if ($(this).text() == item_arr[i]){
          $(this).click();
          return false;
        }
      });
    }

    self.delCheckedItem();

  },
  addCheckedItem: function(){
    var self = this;
    self.box.find('li').off('click').on('click', function(){
      var html = '<span>'+
          '<span class="checked-name">'+$(this).text()+'</span>'+
          '<span class="item-del">&#x2716;</span>'+
        '</span>';
      self.box.find('.checked-list').append(html);

      //checked-list>span对象大小调整
      self.box.find('.checked-list>span').css({
        "line-height": self.input_h - 10 + "px",
      });
      self.input_obj.val(self.input_obj.val() + $(this).text()+";");
      self.delCheckedItem();

      $(this).addClass('item-checked');

      //如果所有项都被选中，隐藏下拉框selection-item
      if (self.box.find('.item-checked').length == self.box.find('li').length){
        self.box.find('.selection-item').slideUp(10);
      }
    });
  },
  delCheckedItem: function(){
    var self = this;
    self.box.find('.item-del').off('click').on('click', function(e){
      e.stopPropagation();
      var text = $(this).prev('span').text();
      self.box.find('.item-checked').each(function(){
        if ($(this).text() == text){
          $(this).removeClass('item-checked');
          self.input_obj.val(self.input_obj.val().replace(text + ";", ""));
          return false;
        }
      });
      $(this).parent('span').remove();
    });
  },
  closeSectionItem: function(){
    // 点击空白处下拉框消失
    $('body').on('click', function(){
      $('.selection .selection-item').slideUp(100);
    });
    // 点击selection容器时，下拉框不消失
    $('.selection').on('click', function(e){
      e.stopPropagation();
    });
  }
}
selection._init();