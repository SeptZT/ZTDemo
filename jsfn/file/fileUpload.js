/* *
 * 插件不兼容IE9-
 * 
 * 默认参数DEFAULTS = {}  url必需传，其他参数可选
 * @param   url          [string, ajax请求的url路径]
 * @param   drag         [boolean, 拖拽上传, 默认true]
 * @param   progress     [boolean, 进度条, 默认true]
 * @param   successTips  [boolean, 上传完成提示, 默认true]
 * @param   preview      [boolean, 图片预览, 默认false]
 * @param   onSuccess    [function, 上传完成回调]
 * @param   onError      [function, 错误处理]
 * @param   mimeTypes    [array, 文件类型限制]
 * @param   size         [number, 单文件大小限制,（单位KB）]
 * @param   maximum      [number, 可同时上传的最大个数, 默认5个]
 * */
function file(ele, opts, handle) {
  this.DEFAULTS = {
    url: '',
    drag: true,
    progress: true,
    successTips: true,
    preview: false,
    onSuccess: function(res) {
      this.box.find('.isup .file-status').addClass('success').html('上传成功');
    }.bind(this),
    onError: function(err) {
      this.box.find('.isup .file-status').addClass('err').html('上传失败');
    }.bind(this),
    mimeTypes: null,
    size: null,
    maximum: 5,    
  };

  this.box = $(ele);
  this.opts = $.extend({}, this.DEFAULTS, opts);
  
  this.fileArr = [];  // 待上传文件数组
  this.loadedSize = 0;  // 已上传文件大小
  this.totalSize = 0; // 所有文件大小
  this.upindex = 0; // 数组中第一个未上传的文件索引

  if(handle) {
    this.handle = handle; // 回调函数
  }

  this._init(); // 生成文件上传框 ，并注册相应事件  
}

/* *
 * 生成文件上传框 
 * */
file.prototype._init = function() {
  var box_html = '<div class="file-box file-drag">' +
                    '<ul class="file-list"></ul>' +
                    '<div class="drop-box choose">+</div>' +
                    '<input type="file" multiple class="hide"/>' +
                    '<div class="up-file">' +
                      '<div class="pro-bar hide">' +
                        '<div class="pro animation"></div>' +
                      '</div>' +
                      '<div class="per hide">0%</div>' +
                      '<div class="up-handle">' +
                        '<span class="tips hide">文件格式不正确</span>' +
                        '<button class="clear-all">清空列表</button>' +
                        '<button class="upfile-all">全部上传</button>' +
                      '</div>' +
                    '</div>' +
                  '</div>';

  this.box.append(box_html);
  
  this._choose(); // 文件点击选择
  this._drag(); // 文件拖拽  
  this._fileChange(); // 文件选择框的值发生变化
  this._fileUpAll(); // 上传全部文件
  this._clearList(); // 清空列表
};

/* *
 * 选择文件
 * */
file.prototype._choose = function() {
  var file_input = this.box.find('input[type=file]');    
  
  $('.file-box .choose').off('click').on('click', function() {
    if ($(this).hasClass('disable')) {
      alert('文件上传中，请等待文件上传完成后再选择');
      return;
    }

    file_input.val('');  // 文件输入框清空
    file_input.click();    
  });
};

/* *
 * input=file输入框的值发生变化
 * */
file.prototype._fileChange = function() {
  var _this = this;
  this.box.find('input[type=file]').off('change').on('change', function() {       
    _this._handleFiles(this.files);
  });
};

/* *
 * 文件拖拽 
 * */
file.prototype._drag = function() {
  var ele = this.box.find('.drop-box')[0];

  if(this.opts.drag == false) {
    return;
  }
  
  ele.addEventListener('dragleave', function(e) {
    this._dragDeal(e, false);
  }.bind(this));
  ele.addEventListener('dragenter', function(e) {
    this._dragDeal(e, true);
  }.bind(this));
  ele.addEventListener('dragover', function(e) {
    this._dragDeal(e, true);
  }.bind(this));
  ele.addEventListener('drop', function(e) {
    this._dragDeal(e, false);
    
    if (this.box.find('.choose').hasClass('disable')) {
      alert('文件上传中，请等待文件上传完成后再选择');
      return;
    }
    this._handleFiles(e.dataTransfer.files);
  }.bind(this));
};

/* * 
 * 文件拖拽处理, 拖入: status=true; 拖出: status=false;
 * */
file.prototype._dragDeal = function(e, status) {
  var e = e || window.event,
      dropbox = this.box.find('.drop-box');
      
  e.stopPropagation();
  e.preventDefault();
  if (status) {
    dropbox.addClass('drop-color');
  } else {
    dropbox.removeClass('drop-color');
  }  
}

/* * 
 * 处理选中的文件
 * */
file.prototype._handleFiles = function(files) {
  var filesArr = [];
  
  // 如果列表中的文件已上传，清空列表
  if (this.fileArr.length == this.upindex) {
    this._reset();
  }
  
  for(var i = 0; i < files.length; i++) {
    var check = this._checked(files[i]); // 验证文件格式是否正确

    if(check) {
      this._isExist(files[i].name); // 判断文件是否存在；若存在，替换
      this.totalSize += files[i].size;
      this.fileArr.push(files[i]);
      filesArr.push(files[i]);
    }
  }
  if (this.opts.preview) {
    this._preview(filesArr);
  } else {
    this._fileList(filesArr);
  }  
};

/* * 
 * 生成文件列表
 * */
file.prototype._fileList = function(files) {
  var html_arr = [];

  for(var i = 0; i < files.length; i++) {
    
    html_arr.push('<li class="item">' +
        '<div class="file-name" title="' + files[i].name + '">' + files[i].name + '</div>' +
        '<div class="file-status">等待上传</div>' +
        '<div class="file-handle">' +
          '<span class="theme-color cancel-icon" title="取消">&times;</span>' +
        '</div>' +
      '</li>');
  }
  this.box.find('.file-list').append(html_arr.join(''));
  
  this._fileCancel();
};

/* *
 * 图片预览
 * */
file.prototype._preview = function(files) {
  var html_arr = [],
      i = 0,
      _this = this;

  var fileRead = function() {
    if (i == files.length) {
      _this.box.find('.file-list').append(html_arr.join(''));
      _this._fileCancel();
      return;
    }    
    var file = files[i],
        reader = new FileReader();
        
    reader.readAsDataURL(files[i]);   
    reader.onload = function(e) {
      var e = e || window.event;

      html_arr.push('<li class="preview">' +
          '<img src="'+e.target.result+'"/>' +
          '<div class="cancel-icon hide">&times;</div>' +
          '<p class="hide" title="'+files[i].name+'">' + files[i].name + '</p>' +
        '</li>');
      i++;
      fileRead();
    }
  };
  fileRead(i);  
};

/* *
 * 取消选中文件
 * */
file.prototype._fileCancel = function() {
  var _this = this;
  this.box.find('.cancel-icon').off('click').on('click', function(e) {
    e.stopPropagation();
    if($(this).hasClass('disable')) {
      return;
    }
    var obj = $(this).parents('li').eq(0);
    var index = obj.index();

    obj.fadeOut(function() {
      $(this).remove();
      _this.fileArr.splice(index, 1);
    });
  });
};

/* *
 * 上传全部文件 
 * */
file.prototype._fileUpAll = function() {
  var box = this.box;
  box.find('.upfile-all').off('click').on('click', function(e) {
    e.stopPropagation();
    if(box.find('.upfile-all').hasClass('disable')) {
      return;
    }

    if(this.fileArr.length == 0) {
      this._fileTips('请选择文件');
      return;
    }
    
    this._reset('reUp');
    this._fileLoad();
  }.bind(this));
};

/* *
 * 清空文件列表
 * */
file.prototype._clearList = function() {
  var _this = this;

  this.box.find('.clear-all').off('click').on('click', function() {
    if($(this).hasClass('disable')) {
      return;
    }
    _this._reset();
  });
};

/* *
 * 重置 
 * */
file.prototype._reset = function(status) {
  // status = reUp表示不改变文件列表，重新上传文件
  if (status && status == 'reUp'){
    this.box.find('.pro').css('width', '0%');
    this.box.find('.up-file .per').html('0%');
    this.box.find('.file-status').html('等待上传');
  } else {    
    this.box.find('.pro-bar, .per').addClass('hide'); // 隐藏进度条和百分比  
    this.box.find('ul').html(''); // 情况文件列表
    this.fileArr = [];  // 选中文件清空
    this.totalSize = 0; // 总文件大小设为0
  }
  this.loadedSize = 0;  // 已上传文件大小设为0     
  this.upindex = 0; // 已上传的文件索引
};

/* *
 * 多文件上传
 * */
file.prototype._fileLoad = function() {
  var len = this.fileArr.length,
      total = 0;
      formData = new FormData();
  if(len - this.upindex > this.opts.maximum) {
    len = this.upindex + this.opts.maximum;
  }
  
  while(this.upindex < len) {
    this.box.find('.pro').addClass('animation');
    this.box.find('li').eq(this.upindex).addClass('isup').find('.file-status').html('正在上传');
    total += this.fileArr[this.upindex].size;    
    formData.append('file', this.fileArr[this.upindex]);
    this.upindex++;
  }

  // 若回调函数存在
  if(this.handle) {
    formData = this.handle(formData);
  }
  
  if (this.opts.progress) {
    this.box.find('.pro-bar, .per').removeClass('hide'); 
  }   
  
  this.box.find('.clear-all, .upfile-all, .cancel-icon, .choose').addClass('disable');
  this._upload(formData, total);
}

/* *
 * 验证文件大小、格式  
 * */
file.prototype._checked = function(file) {
  var opts = this.opts,
    name = file.name, // 文件名字
    check = true;

  // 验证文件大小
  if(opts.size && opts.size < file.size) {
    this._fileTips(name + '文件过大');
    check = false;
  }

  // 验证文件格式
  if(opts.mimeTypes) {
    var pattern = new RegExp(opts.mimeTypes.join('|')), // 正则表达式，验证文件格式
        type = name.slice(name.lastIndexOf('.') + 1, name.length); // 文件类型

    if(!pattern.test(type)) {
      this._fileTips(name + '文件格式不正确');
      check = false;
    }
  }
  return check;
};

/* *
 * 验证文件是否重复  
 * */
file.prototype._isExist = function(name) {
  for(var i = 0; i < this.fileArr.length; i++) {
    if(this.fileArr[i].name == name) {
      this.box.find('li').eq(i).remove();
      this.fileArr.splice(i, 1);
      console.log(i);
      break;
    }
  }
}

/* *
 * 文件提示信息 
 * */
file.prototype._fileTips = function(text) {
  var box = this.box;

  box.find('.tips').html(text).fadeIn();
  setTimeout(function() {
    box.find('.tips').fadeOut();
  }, 5000);
};

/* *
 * 文件上传
 * */
file.prototype._upload = function(formData, total) {
  var _this = this,
    box = this.box;

  var XHR = $.ajax({
    type: 'post',
    data: formData,
    dataType: 'json',
    url: _this.opts.url,
    processData: false, // 告诉jQuery不要去处理发送的数据
    contentType: false, // 告诉jQuery不要去设置Content-Type请求头   
    success: function(res) {
      if(_this.opts.successTips) {
        _this.opts.onSuccess(res); // 成功
      }
    },
    error: function(err) {
      _this.opts.onError(err); // 失败
    },
    complete: function() {
      box.find('.isup').removeClass('isup');
      box.find('.pro').removeClass('animation');
      _this.loadedSize += total;
      if(_this.fileArr.length > _this.upindex) {
        _this._fileLoad();        
      } else {
        box.find('.pro').css('width', '100%');
        box.find('.up-file .per').html('100%'); 
        box.find('.clear-all, .upfile-all, .cancel-icon, .choose').removeClass('disable');
      }
    },
    xhr: function() {      
      var xhr = $.ajaxSettings.xhr();

      if(xhr.upload) {
        _this._progress(xhr);
        return xhr;
      }
    }
  });
};

/* *
 * 进度条 
 * */
file.prototype._progress = function(xhr) {  
  xhr.upload.addEventListener('progress', function(e) {
    if(e.lengthComputable) {
      var loaded = this.loadedSize + e.loaded,
          percentage = Math.round(loaded * 100 / this.totalSize);
      if (percentage > 98) {
        return;
      }
      this.box.find('.pro').css('width', percentage + '%');
      this.box.find('.up-file .per').html(percentage + '%');      
    }
  }.bind(this));
};

/* *
 * 封装成jQuery方法
 * */
;$.fn.extend({
  uploader: function(opts, handle) {
    if(opts.url) {
      new file(this, opts, handle);
    } else {
      alert('uploader方法的url不能为空');
    }
    return this;
  }
});