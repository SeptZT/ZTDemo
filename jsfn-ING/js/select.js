class Select {
  constructor() {
    this.timeoutId = null;
    this._create();
  }

  _create() {
    let $ele = $('.select-box');
    let len = $ele.length;
    $ele.find('.checked, ul, i').remove();
    for (let i = 0; i < len; i++) {
      let html = '';
      let $opts = $ele.eq(i).find('option');
      let li_html = '';
      let checked_html = '';
      let value = $ele.eq(i).find('select').val();
      $opts.each(function(i) {
        if (!value && i === 0) {
          checked_html = `<div class="checked">${$(this).text()}</div>`;
          li_html += `<li class="selected" _val=${$(this).val()}>${$(this).text()}</li>`;
        } else if (value && value === $(this).val()) {
          checked_html = `<div class="checked">${$(this).text()}</div>`;
          li_html += `<li class="selected" _val=${$(this).val()}>${$(this).text()}</li>`;
        } else {
          li_html += `<li _val=${$(this).val()}>${$(this).text()}</li>`;
        }
      });
      html += `
        ${checked_html}
        <i class="iconfont">&#xe641;</i>
        <ul>${li_html}
        </ul>`;
      $ele.eq(i).append(html);
    }
    this._show();
    this._change();
    this._clickBlank();
  }

  _show() {
    $('.select-box .checked, .select-box i').off('click').on('click', function(e) {
      let $ul = $(this).siblings('ul');
      e.stopPropagation();
      $('.select-box ul').slideUp(function() {
        $(this).parents('.select-box').removeClass('select-show-bottom');
      });
      if ($ul.is(':hidden')) {
        $ul.slideDown();
        $ul.scrollTop(0);
        $ul.parents('.select-box').addClass('select-show-bottom');
      } else {
        $ul.slideUp(function() {
          $ul.parents('.select-box').removeClass('select-show-bottom');
        });

      }
    });
  }

  _change() {
    $('.select-box li').off('click').on('click', function() {
      let $sel_box = $(this).parents('.select-box');
      $sel_box.find('li').removeClass('selected');
      $sel_box.find('ul').slideUp(function() {
        $sel_box.removeClass('select-show-bottom');
      });
      $(this).addClass('selected');
      if ($(this).attr('_val') !== $sel_box.find('select').val()) {
        $sel_box.find('select').val($(this).attr('_val'));
        $sel_box.find('select').trigger('change');
        $sel_box.find('.checked').text($(this).text());
      }
    });
  }

  _clickBlank() {
    $(document).on('click', function() {
      $('.select-box ul').slideUp(function() {
        $(this).parents('.select-box').removeClass('select-show-bottom');
      });
    });
  }
}
module.exports = function() {
  return new Select();
}