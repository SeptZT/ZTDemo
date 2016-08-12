var nowPage = 1;
var lastPage;
var pageCount = 10; //默认显示的翻页条数

/**
 * 生成页码区域
 * @param  {[type]} id        [容器ID]
 * @param  {[type]} totalPage [总页数]
 * @param  {[type]} handle    [回调函数多为获取翻页数据的方法]
 * @return {[type]}           [description]
 */
function _init(id, totalPage, handle) {
	var loopStart, loopEnd, tmp, startClass, endClass;
	var $dom = $("#" + id);

	if (!totalPage) {
		$dom.html("");
		return;
	}
	totalPage = parseInt(totalPage);
	lastPage = totalPage;
	$dom.html("");

	if (totalPage < 10) {
		loopStart = 1;
		loopEnd = totalPage;
	} else {
		tmp = totalPage - nowPage;
		if (tmp >= 10) {
			loopStart = nowPage;
			loopEnd = nowPage + 9;
		} else {
			loopStart = nowPage - (9 - tmp);
			loopEnd = totalPage;
		}
	}

	if (nowPage === 1) {
		startClass = "page-disabled";
	}

	if (nowPage === totalPage) {
		endClass = "page-disabled";
	}

	$dom.append($("<a class='" + startClass + "' href='javascript:void(0);' title='第一页' index='n1'>&lt&lt</a>"));
	$dom.append($("<a class='" + startClass + "' href='javascript:void(0);' title='上一页' index='-1'>&lt</a>"));

	for (var i = loopStart; i <= loopEnd; i++) {
		$dom.append($("<a class='" + (nowPage === i ? "selected" : "") + "' href='javascript:void(0);' index='" + i + "'>" + i + "</a>"));
	}

	$dom.append($("<a class='" + endClass + "' href='javascript:void(0);' title='下一页' index='0'>&gt</a>"));
	$dom.append($("<a class='" + endClass + "' href='javascript:void(0);' title='最后一页' index='n0' class='last-child'>&gt&gt</a>"));
	$dom.append($("<input class='inputText_style' type='text'/><button class='botton_style iconfont'>&#xe60d;</button><span>" + totalPage + "页</span>"));

	_bind(handle, $dom);
	_enter(handle);
}

function _bind(handle, $dom) {
	if (!handle || typeof handle !== "function") {
		console.warn("no callback bind to pagenation！");
	} else {
		$dom.off("click").on("click", function(e) {
			var index = $(e.target).attr("index");
			var target = e.target;
			var className = target.className;

			if (target.tagName === "BUTTON") {
				_goTo(target, handle);
			}

			if (target.tagName !== "A") {
				return;
			}

			if (className === "selected") {
				return;
			}

			if (className === "page-disabled") {
				return;
			}
			//上一页
			if (index == -1) {
				if (nowPage === 1) {
					return;
				}
				handle(--nowPage);
				return;
			}
			//下一页
			if (index == 0) {
				if (nowPage == lastPage) {
					return;
				}
				handle(++nowPage);
				return;
			}
			//第一页
			if (index == "n1") {
				handle(nowPage = 1);
				return;
			}
			//最后一页
			if (index == "n0") {
				handle(nowPage = lastPage);
				return;
			}
			nowPage = parseInt(index);
			handle(nowPage);
		});
	}
}

function _goTo(target, handle) {
	var $dom = $(target).prev();
	var val = $dom.val();
	if (isNaN(val)||val<=0||!(/^\d+$/.test(val))) {
		if ($dom.val() != "") {
			$('.pagenation').append('<span class="err_tip">输入有误</span>');
			setTimeout(function() {
				$('.pagenation .err_tip').fadeOut();
			}, 1000);
		}
		$dom.val("");
		return;
	}
	if (val < 1 || val > lastPage || val == nowPage) {
		if (val != nowPage) {
			$('.pagenation').append('<span class="err_tip">输入有误</span>');
			setTimeout(function() {
				$('.pagenation .err_tip').fadeOut();
			}, 1000);
		}
		$dom.val("");
		return;
	}
	handle(nowPage = parseInt(val));
}

function _enter(handle) {
	$(document).on("keyup", function(e) {
		if (e.keyCode == 13) {
			_goTo($(".pagenation button")[0], handle);
		}
	});
}

/**
 * 重置nowpage  业务逻辑中使用的方法
 * 如果发现业务逻辑无法重置当前页码  请手动调用该方法重置当前页码
 * 多数无法重置的BUG发生在搜索-还原以后
 * @return {[type]} [description]
 */
function _resetNowPage() {
	nowPage = 1;
}

module.exports.init = _init
module.exports.reset = _resetNowPage;

/*使用
 _init("page", json["data"]["total"] / pagesize,function(nowPage){
  page = nowPage;
  getSoftList();
});
*/