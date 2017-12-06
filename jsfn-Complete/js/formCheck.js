function FormCheck(handle, pattern, opts) {
  this.patterns = $.extend({}, this.PATTERNS, pattern);
  this.handle = handle;
  this.opts = $.extend({}, this.DEFAULTS, opts);
  this._check();
}

FormCheck.prototype.DEFAULTS = {
  selector: 'body'
};

FormCheck.prototype.PATTERNS = {
  required: /\S+/,  // 必填
  nums: /^\d*$/,
  IDCard: /^(\d{15}$|^\d{17}(\d|X|x))$/,
  email: /^([\w\.\-]+)@([\w\.\_]+)\.([\w]{2,4})$/,
  // 多个邮件，以逗号间隔
  emails: /^(([\w\.\-]+)@([\w\.\_]+)\.([\w]{2,4})($|,|，))*$/,
  tel: /^((\+?86)|(\(\+86\)))?(1[0-9]{10})$/,   // 手机号
  // 域名
  domain: /^(?=^.{3,255}$)[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$/,
  ip: /^((25[0-5]|2[0-4]\d|[01]?\d\d?)($|(?!\.$)\.)){4}$/,
  port: /^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/
};

FormCheck.prototype._check = function() {
  var _this = this;

  $(this.opts.selector).find(':input[check-type]').on('blur', function() {
    var val = this.value;
    var checkArr = _this._dealAttribute(this, 'check-type').split(' ');;
    var res = { result: true, errType: '', des: [] };

    if (val === '') {
      if (checkArr.indexOf('required') !== -1) {
        res.result = false;
        res.errType = 'required';
      }
      _this._dealRes(this, res);
      return;
    }

    res.result = typeof this.getAttribute('check-any') === 'string' ? false : true;
    res = _this._checkValue(res, checkArr, val);

    _this._dealRes(this, res);
  });
};

FormCheck.prototype._checkValue = function(res, checkArr, val) {
  for (let i = 0, len = checkArr.length; i < len; i++) {
    let item = checkArr[i];

    if (item === 'required') { continue; }
    if (!this.patterns[item]) {
      res.des.push('没有 check-type = ' + item + ' 的正则验证，请自定义');
      continue;
    }
    let check = this.patterns[item].test(val);
    if (!check && res.result) {
      res.result = false;
      res.errType = item;
      break;
    }
    if (check && !res.result) {
      res.result = true;
      res.des.push(item + '验证通过');
      break;
    }
  }
  return res;
};

FormCheck.prototype._dealRes = function(elem, res) {
  var handle = this.handle;

  res.result ? $(elem).removeClass('zt-check-err') : $(elem).addClass('zt-check-err');

  if(handle && typeof handle === 'function') {
    handle(elem, res);
  }
};

FormCheck.prototype._dealAttribute = function(elem, attribute, value) {
  var str = elem.getAttribute(attribute) || '';;
  if (value) {
    var reg = new RegExp('\\b' + value + '\\b', 'ig');
    str = str.replace(reg, '');
  }
  return str.replace(/\s+/g, ' ').replace(/(^\s*)|(\s*$)/g, '');
};

FormCheck.prototype._removeCheckType = function(elem, checkType) {
  $(elem).removeClass('zt-check-err');
  elem.setAttribute('check-type', this._dealAttribute(elem, 'check-type', checkType));
};

FormCheck.prototype._addCheckType = function(elem, checkType) {
  var checkS = this._dealAttribute(elem, 'check-type', checkType);
  elem.setAttribute('check-type', checkS + ' ' + checkType);
};

FormCheck.prototype._isForm = function(selector) {
  selector = selector ? selector : this.opts.selector;
  var elem = document.querySelector(selector);

  if (elem.querySelectorAll('.zt-check-err[check-type]').length) {
    return false;
  }

  var requireArr = elem.querySelectorAll('[check-type~=required]');
  var result = true;

  for (var i = 0, len = requireArr.length; i < len; i++) {
    if (requireArr[i].value === '') {
      this._dealRes(requireArr[i], { result: false, errType: 'required' });
      result = false;
    }
  }

  return result;
};