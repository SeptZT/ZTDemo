class FormCheck {
  constructor(handle, pattern, opts) {
    this.__proto__.DEFAULTS = {
      selector: 'body'
    };
    this.__proto__.PATTERNS = {
      required: /\S+/,
      nums: /^\d+$/,
      IDCard: /^(\d{15}$|^\d{17}(\d|X|x))$/,
      email: /^([\w\.\-]+)@([\w\.\_]+)\.([\w]{2,4})$/,
      // 多个邮件，以逗号间隔
      emails: /^(([\w\.\-]+)@([\w\.\_]+)\.([\w]{2,4})($|,|，))+$/,
      tel: /^((\+?86)|(\(\+86\)))?(1[0-9]{10})$/, // 手机号
      // 域名
      domain: /^(?=^.{3,255}$)[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$/,
      ip: /^((25[0-5]|2[0-4]\d|[01]?\d\d?)($|(?!\.$)\.)){4}$/,
      port: /^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/,
      url: /[a-zA-z]+:\/\/[^\s]+/,
      chinese: /^[\u4e00-\u9fa5]+$/,  // 汉字
    };

    this.handle = handle;
    this.patterns = Object.assign({}, this.PATTERNS, pattern);
    this.opts = Object.assign({}, this.DEFAULTS, opts);
    this._check();
  }

  _check() {
    let _this = this;
    let elems = document.querySelectorAll(this.opts.selector + ' [check-type]');

    elems.forEach(function(elem) {
      elem.addEventListener('blur', function() {
        let val = this.value;
        let checkArr = _this._dealAttribute(this, 'check-type').split(' ');;
        let res = { result: true, errType: '', des: [] };

        if (val === '') {
          if(checkArr.indexOf('required') !== -1) {
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
    });
  }

  _checkValue(res, checkArr, val) {
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
  }

  _dealRes(elem, res) {
    let handle = this.handle;
    let classStr = this._dealAttribute(elem, 'class', 'zt-check-err')

    res.result ? elem.setAttribute('class', classStr) :
      elem.setAttribute('class', classStr + ' zt-check-err');

    if (handle && typeof handle === 'function') {
      handle(elem, res);
    }
  }

  _dealAttribute(elem, attribute, value) {
    let str = elem.getAttribute(attribute) || '';
    if (value) {
      let reg = new RegExp('\\b' + value + '\\b', 'ig');
      str = str.replace(reg, '');
    }
    return str.replace(/\s+/g, ' ').replace(/(^\s*)|(\s*$)/g, '');
  }

  _isForm(selector) {
    selector = selector ? selector : this.opts.selector;
    let elem = document.querySelector(selector);

    if (elem.querySelectorAll('.zt-check-err[check-type]').length) {
      return false;
    }

    let requireArr = elem.querySelectorAll('[check-type~=required]');
    let result = true;

    for (let i = 0, len = requireArr.length; i < len; i++) {
      if (requireArr[i].value === '') {
        this._dealRes(requireArr[i], {
          result: false,
          errType: 'required'
        });
        result = false;
      }
    }

    return result;
  }
}