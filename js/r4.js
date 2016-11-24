/**
* jBase.js
* version 1.0
* author LT
* date begin at 2014-12-12 end at 2015-01-19
* change
*     ### r4.js的基础是base.js ###
*			### 确定自己的命名空间 ###
*			### 调用方式由_$变成了r4 ###
*/
(function(window){
	"use strict";
	//document navigator location
	var document = window.document,
		 	navigator = window.navigator,
			location = window.location;

	/**
	* @param str domObj
	* @return new init();
	*/
	var _jBase = function(selector){
		return new _jBase.fn.init(selector);
	};

	_jBase.fn = _jBase.prototype;

	//init  to get dom
	_jBase.fn.init = function(selector){
		var ele, tmp, i, eles;
		
		//add selector
		this.selector = selector;
		//add length default 0
		this.length = 0;
		//add from default null
		this.from = null;
		//handle r4("") or r4(null) or r4(undefined)
		if(!selector){
			return;
		}
		//handle body
		if(selector === "body"){
			this[0] = document.body;
			this.length++;
			return;
		}
		//handle String，support tagName,className,id
		if(typeof selector === "string"){
			//#ID
			if(selector.indexOf("#") === 0){
				tmp = selector.split("#")[1]
				if(!tmp){
					return;
				}
				ele = document.getElementById(tmp);
				this[0] = ele;
				this.length++;
				//.className 
			}else if(selector.indexOf(".") === 0){
				//support document.querySelectorAll
				if(document.querySelectorAll){
					ele = document.querySelectorAll(selector);
					for(i = 0; i < ele.length; i++){
						this[i] = ele[i];
						this.length++;
					}
				//not support document.querySelectorAll, so use document.all
				}else{
					tmp = selector.split(".")[1];
					if(!tmp){
						return;
					}
					eles = document.all;
					for(i = 0; i < eles.length; i++){
						if(eles[i].className && eles[i].className.indexOf(tmp) >= 0){
							this[this.length] = eles[i];
							this.length++;
						}
					}
				}
			//tagName
			}else{
				ele = document.getElementsByTagName(selector);
				//put domList in jBase
				for(i = 0; i < ele.length; i++){
					this[i] = ele[i];
					this.length++;
				}
			}
		}
		//handle dom
		if((typeof selector === "object" && selector.nodeType) || selector.navigator){
			this[0] = selector;
			this.length++;
		}
		return this;
	};

	//获取原始dom节点
	_jBase.fn.get = function(index){
		return this[parseInt(index)];
	};

	//获取单个r4对象
	_jBase.fn.getR4 = function(index){
		var node = new this.init();
		if(this[index]){
			node[0] = this[index];
			node.length++;
			node.selector = this.selector + ",getR4()";
			node.from = this;
		}
		return node;
	};

	//获取父节点 只支持第一个元素
	_jBase.fn.parent = function(){
		var parent = new this.init();
		if(this[0] && this[0].parentNode){
			parent[0] = this[0].parentNode;
			parent.selector = this.selector + ",parent()";
			parent.from = this;
			parent.length++;
		}
		return parent;
	};
	//获取子节点, 只支持第一个元素
	_jBase.fn.children = function(){
		var children = new this.init(),
				ele, i;
		if(this[0] && this[0].childNodes){
			ele = this[0].childNodes;
			for(i = 0; i < ele.length; i++){
				//去掉text节点
				if(ele[i].nodeName === "#text"){
					continue;
				}
				children[children.length] = ele[i];
				children.length++;
				children.selector = this.selector + ",parent()";
				children.from = this;
			}
			return children;
		}
	};

	//获取上一个节点 只支持第一个元素
	_jBase.fn.prev = function(){
		var prev = new this.init();
		if(this[0] && this[0].previousSibling){
			prev[0] = this[0].previousSibling;
			prev.length++;
			prev.selector = this.selector + ", prev()";
			prev.from = this;
		}
		return prev;
	};

	//获取下一个节点 只支持第一个元素
	_jBase.fn.next = function(){
		var next = new this.init();
		if(this[0] && this[0].nextSibling){
			next[0] = this[0].nextSibling;
			next.length++;
			next.selector = this.selector + ", next()";
			next.from = this;
		}
		return next;
	};

	//innerHTML or get innerHTML
	//在获取html的时候将结束链式调用
	_jBase.fn.html = function(html){
		var i;
		//do innerHTML
		if(html !== undefined){
			for(i = 0; i < this.length; i++){
				this[i].innerHTML = html;
			}
			return this;
		//do get innerHTML only this[0]
		}else{
			if(this[0]){
				return this[0].innerHTML;
			}
		}
	};
	// get value or set value
	//在获取value的时候将结束链式调用
	_jBase.fn.val = function(val){
		var i;
		//do set value
		if(val || val === ""){
			for(i = 0; i < this.length; i++){
				this[i].value = val;
			}
			return this;
		// do get value 
		}else{
			if(this[0]){
				return this[0].value;
			}
		}
	};

	//appendChild
	_jBase.fn.append = function(child){
		var i;
		if(!child){
			return;
		}
		for(i = 0; i < this.length; i++){
			this[i].appendChild(child);
		}
		return this;
	};

	//removeChild
	_jBase.fn.remove = function(child){
		var i;
		if(!child){
			return;
		}
		for(i = 0; i < this.length; i++){
			this[i].removeChild(child);
		}
		return this;
	};

	//addClass
	_jBase.fn.addClass = function(className){
		var i;
		if(!className || typeof className !== "string"){
			return;
		}
		for(i = 0; i < this.length; i++){
			this[i].className = this[i].className + " " + className;
		}
		return this;
	};

	//removeClass
	_jBase.fn.removeClass = function(className){
		var i, j, arr;
		if(!className || typeof className !== "string"){
			return;
		}
		for(i = 0; i < this.length; i++){
			arr = this[i].className.split(" ");
			for(j = 0; j < arr.length; j++){
				if(arr[j] === className){
					arr.splice(j, 1);
				}
			}
			this[i].className = arr.join(" ");
		}
		return this;
	};

	//getClassName  只支持第一个元素
	//此方法将结束链式调用
	_jBase.fn.getClass = function(){
		return this[0].className;
	};

	//setAttribute 只支持第一个元素
	//obj{name: "value"} 支持多组
	//在获取attribute的时候将结束链式调用
	_jBase.fn.attr = function(obj){
		var i, j;
		//添加attribute
		if(typeof obj === "object"){
			for(i in obj){
				for(var j = 0; j < this.length; j++){
					this[j].setAttribute(i, obj[i]);
				}
			}
			return this;
		//获取attribute
		}else{
			return this[0].getAttribute(obj);
		}
	};

	//removeAttribute
	_jBase.fn.removeAttr = function(name){
		var i;
		for(i = 0; i < this.length; i++){
			this[i].removeAttribute(name);
		}
		return this;
	};

	//do css style 支持多组
	//在获取style的时候将结束链式调用
	_jBase.fn.css = function(obj, value){
		var i, j
		//多组
		if(typeof obj === "object"){
			for(i in obj){
				for(j = 0; j < this.length; j++){
					this[j].style[i] = obj[i];
				}
			}
			return this;
		}else if(typeof obj === "string"){
			//单组
			if(value){
				for(j = 0; j < this.length; j++){
					this[j].style[obj] = value;
				}
				return this;
			//获取style 只支持第一个元素
			}else{
				return this[0].style[obj];
			}
		}
	};

	//事件代理函数
	var _eventProxy = function(e){

		var eventType, i, obj;

		e = e || window.event;

		eventType = e.type;

		//非IE浏览器
		//try{
			if(this.hanlders){
				for(i = 0; i < this.hanlders[eventType].length; i++){
					//将this指向html节点
					this.hanlders[eventType][i].apply(this, arguments);
				}
			//IE
			}else{
				obj = e.srcElement || e.target;

				for(i = 0; i < obj.hanlders[eventType].length; i++){
					obj.hanlders[eventType][i].apply(obj, arguments);
				}
			}
		//}catch(e){console.debug(e)}
	};

	//事件绑定
	_jBase.fn.on = function(eventType, hanlder, useCapture){

		if(!eventType || typeof eventType !== "string"){
			return;
		}

		var i, ele;

		if(!hanlder || typeof hanlder !== "function"){
			//如果没有回调函数，执行return false
			hanlder = this.returnFalse;
		}

		useCapture = useCapture || false;

		for(i = 0 ; i < this.length ; i++){
			ele = this[i];
			//如果不存在，新建事件散列表
			if(!ele.hanlders){
				ele.hanlders = {};
			}
			//如果对应的事件回调函数数组不存在，新建数组
			if(!ele.hanlders[eventType]){
				ele.hanlders[eventType] = [];
			}
			//????当存在相同的事件的时候，先移除以前的事件?????
			if(ele.removeEventListener){
				ele.removeEventListener(eventType, _eventProxy, useCapture);
			}else{
				ele.detachEvent("on" + eventType, _eventProxy);
			}
			//将对应的事件回调函数保存到数组中
			ele.hanlders[eventType].push(hanlder);
			
			//注册事件
			if(ele.addEventListener){
				//使用代理机制，相同的事件只注册一次，按照先后顺序执行
				ele.addEventListener(eventType, _eventProxy, useCapture);
			}else{
				ele.attachEvent("on" + eventType, _eventProxy);
			}
		}

	};

	//取消事件绑定
	_jBase.fn.off = function(eventType, hanlder, useCapture){
		if(!eventType || typeof eventType !== "string"){
			return;
		}

		var i, j, ele;

		useCapture = useCapture || false;

		for(i = 0 ; i < this.length ; i++){
			ele= this[i];

			try{
				delete ele.hanlders[eventType];
			}catch(e){}

			if(ele.removeEventListener){
				ele.removeEventListener(eventType, _eventProxy, useCapture);
			}else{
				ele.detachEvent("on" + eventType, _eventProxy);
			}
		}
	};

	_jBase.fn.returnFalse = function(){
		return false;
	};

	//submit 支持单个元素
	_jBase.fn.submit = function(){
		var ele = this[0];
		if (ele.tagName !== "form") {
			return;
		}
		return this[0].submit();
	};

	//select元素的默认选中
	_jBase.fn.setDefault = function(val){
		var ele = this[0], childs = [], i;
		if(ele.tagName !== "SELECT"){
			return;
		}
		childs = ele.childNodes;
		for(i = 0; i < childs.length; i++){
			if(childs[i].value && childs[i].value === val){
				childs[i].selected = true;
				break;
			}
		}
		return this;
	};

	//获取select选中的value
	//将结束链式调用
	_jBase.fn.getVal = function(){
		var ele = this[0], childs = [], i, value;
		if(ele.tagName !== "SELECT"){
			return;
		}
		childs = ele.childNodes;
		for(i = 0; i < childs.length; i++){
			if(childs[i].value && childs[i].selected == true){
				value = childs[i].value;
				break;
			}
		}
		return value;
	};

	//each
	_jBase.fn.each = function(calback){
		var i;
		if(!callback){
			return;
		}
		for(i = 0; i < this.length; i++){
			callback(this[i], i);
		}
	};

	//链式调用
	_jBase.fn.init.prototype = _jBase.fn;

	//将r4暴露给widnow
	window.r4 = _jBase;

	//createElement
	_jBase.create = function(ele){
		if(!ele || typeof ele !== "string"){
			return null;
		}

		return document.createElement(ele);
	};

	//getXmlHTTPRequest
	//@param <unll>
	//@return <xmlHttpRequest>
	var getXHR = function(){
		var xmlhttp;
		if (window.XMLHttpRequest){
			xmlhttp = new XMLHttpRequest();
		}
		else{
		  	xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		}
		return xmlhttp;
	};

	//ajax
	//@param <json> {url,callback,async,method,params,codeUrl}
	//json参数说明：url, callback, async(true（异步）或 false（同步）默认异步)
	//method(get, post), {postParam<json>}, codeUrl(true, false 默认false)
	//@return <null>
	_jBase.ajax = function(jsonObj){
		var url = "", paramstr = "", xmlhttp = getXHR();
		jsonObj.async = jsonObj.async || true;

		if(typeof jsonObj.callback !== "function"){
			console.error(typeof jsonObj.callback + "is not a function");
			return;
		}
		if(typeof xmlhttp !== "object"){
			console.error("xmlhttp error");
			return;
		}

		for(var i in jsonObj.params){
			paramstr += i + "=" + jsonObj.params[i] + "&";
		}
		paramstr = paramstr.slice(0, -1);
		if(jsonObj.codeUrl){
			url = encodeURI(jsonObj.url);
			if(paramstr){
				paramstr = encodeURI(paramstr);
			}
		}
		if (jsonObj.async) {
			xmlhttp.onreadystatechange = function(){
				if(xmlhttp.readyState == 4 && xmlhttp.status == 200 && jsonObj.callback){
					/*判断登陆过期..*/
					var text = xmlhttp.responseText || xmlhttp.responseXML;
					if (text === "session已过期") {
						alert("登陆过期，请重新登陆!");
						window.location.href = "/";
					}
					jsonObj.callback(xmlhttp.responseText || xmlhttp.responseXML);
				}
			};
		}

		xmlhttp.open(jsonObj.method, jsonObj.url, jsonObj.async || false);
		if(jsonObj.method === "POST"){
			xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		}
		//给http头添加信息，用以确定是否是ajax请求
		xmlhttp.setRequestHeader("x-requested-with","XMLHttpRequest");
		xmlhttp.send(paramstr);

		if(!jsonObj.async){
			callback(responseText || responseXML);
		}
	};
	
	//post
	//@param <json> {url,callback,params,codeUrl}
	//@return <null>
	_jBase.post = function(url, params, callback){
		var jsonObj = {};
		jsonObj.method = "POST";
		jsonObj.async = true;
		jsonObj.url = url;
		jsonObj.params = params;
		jsonObj.callback = callback;
		this.ajax(jsonObj);
	};

	//get
	//@param <json> {url,callback,params,codeUrl}
	//@return <null>
	_jBase.get = function(url, callback){
		var jsonObj = {};
		jsonObj.method = "GET";
		jsonObj.async = true;
		jsonObj.url = url;
		jsonObj.callback = callback;
		this.ajax(jsonObj);
	};

	//判断浏览器类型
	_jBase.browser = function(){
		var browser, userAgent, 
			IE6 = new RegExp("MSIE 6"),
			IE7 = new RegExp("MSIE 7"),
			IE8 = new RegExp("MSIE 8"),
			IE9 = new RegExp("MSIE 9"),
			IE10 = new RegExp("MSIE 10"),
			chrome = new RegExp("Chrome"),
			opera = new RegExp("OPR"),
			firefox = new RegExp("Firefox");

		userAgent = navigator.userAgent;
		
		if(IE6.test(userAgent)){
			browser = "IE6";
		}

		if(IE7.test(userAgent)){
			browser = "IE7";
		}

		if(IE8.test(userAgent)){
			browser = "IE8";
		}

		if(IE9.test(userAgent)){
			browser = "IE9";
		}

		if(IE10.test(userAgent)){
			browser = "IE10";
		}

		if(chrome.test(userAgent)){
			browser = "chrome";
		}

		if(opera.test(userAgent)){
			browser = "opera";
		}

		if(firefox.test(userAgent)){
			browser = "firefox";
		}

		return browser;
	};

	//trim
	_jBase.trim = function(str){
		return str.replace(/(^\s*)|(\s*$)/g, "");
	};

	/**
	 * 日期相减
	 * @param sDate1
	 * @param sDate2
	 * @returns
	 */
	_jBase.dateDiff = function(sDate1,sDate2){
	  var arrDate,objDate1,objDate2,intDays;
	  arrDate=sDate1.split("-");
	  objDate1=new Date(arrDate[1]+'-'+arrDate[2]+'-'+arrDate[0]);
	  arrDate=sDate2.split("-");
	  objDate2=new Date(arrDate[1] + '-'+arrDate[2]+'-'+arrDate[0]);
	  intDays=parseInt(Math.abs(objDate1-objDate2)/1000/60/60/24);
	  return intDays;
	}
	_jBase.dateAdd = function(str,AddDayCount) {
		var stra = str.replace(/-/g,"/");
	  var dd = new Date(stra);
	  dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期
	  var y = dd.getFullYear();
	  var m = dd.getMonth()+1;//获取当前月份的日期
	  var d = dd.getDate();
	  return y+"-"+m+"-"+d;
	}

	/*
	* parseJson兼容
	*	@param String
	* @return json
	*/
	_jBase.parseJSON = function(str) {
		var json;

		if (typeof str === "object") {
			json = str;
		}else {
			str = _jBase.trim(str);

			if (window.JSON && window.JSON.parse) {
				json = JSON.parse(str);
			}else {
				json = (new Function("return " + str))(); 
			}
		}
		return json;
	}

	/*
	* 判断是否为json格式
	*/
	_jBase.isJSON = function(obj) {
		var isjson = typeof(obj) == "object" && Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length;
		
		return isjson;
	}

	/*
	* inJSON 判断某个值是否在该json里面
	* @param json, str
	* @return boolean
	*/
	_jBase.inJSON = function(json, str) {
		var isIN = false, attr;

		if (!_jBase.isJSON(json)) {
			console.error("obj is not a json data!");
			return;
		}
		for (attr in json) {
			if (json[attr] === str) {
				isIN = true;
				break;
			}
		}

		return isIN;
	};

	/*
	*	json to array
	* @param json, array
	*/
	_jBase.jsonToArray = function (json, array){
		var i;

		if (!_jBase.isJSON(json)) {
			console.error("json is not a json data!");
			return;
		}
		if (typeof array !== "object") {
			console.error("array is not a array data!");
			return;
		}

		for (i in json) {
			array[array.length] = json[i];
		}
	};

	//info
	_jBase.info = {
		version: "R4-v1.0",
		name: "LiuTao",
		ID: "rrrr",
		beginDate: "2014-12-12",
		endDate: "",
		description: "Copyright ©2014 刘涛"
	};

	/**
 	* replaceAll
 	*/
	String.prototype.replaceAll = function(s1,s2){
   	  return this.replace(new RegExp(s1,"gm"),s2);
	};

	/*
	* date.format
	*/
	Date.prototype.format=function(fmt) {         
		var o = {         
			"M+" : this.getMonth() + 1, //月份         
			"d+" : this.getDate(), //日         
			"h+" : this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时         
			"H+" : this.getHours(), //小时         
			"m+" : this.getMinutes(), //分         
			"s+" : this.getSeconds(), //秒         
			"q+" : Math.floor((this.getMonth() + 3) / 3), //季度         
			"S" : this.getMilliseconds() //毫秒         
		};         
		var week = {         
		    "0" : "/u65e5",         
		    "1" : "/u4e00",         
		    "2" : "/u4e8c",         
		    "3" : "/u4e09",         
		    "4" : "/u56db",         
		    "5" : "/u4e94",         
		    "6" : "/u516d"        
		};         
		if(/(y+)/.test(fmt)){         
		  fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));         
	 	}         
		if(/(E+)/.test(fmt)){         
		  fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "/u661f/u671f" : "/u5468") : "")+week[this.getDay()+""]);         
		}         
		for(var k in o){         
		  if(new RegExp("("+ k +")").test(fmt)){         
		    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));         
		  }         
		}         
		return fmt;         
	}
	//window.alert(date.format("yyyy-MM-dd EEE hh:mm:ss"));

	//实现console方法
	var func = function () {};

	if (!window.console) {
		window.console = {
			assert: func,
			clear: func,
			count: func,
			debug: func,
			dir: func,
			dirxml: func,
			error: func,
			group: func,
			groupCollapsed: func,
			groupEnd: func,
			info: func,
			log: func,
			markTimeline: func,
			profile: func,
			profileEnd: func,
			table: func,
			time: func,
			timeEnd: func,
			timeStamp: func,
			timeline: func,
			timelineEnd: func,
			trace: func,
			warn: func
		};
	};
	//存储全局方法/变量等
	window.exports = r4.exports = {
		extended: "r4"
	};

	window.exports.getQueryString = function (name){
	    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	    var r = window.location.search.substr(1).match(reg);
	    if (r != null) {
	    	return unescape(r[2]);
	    } 
	    return null;
	};

	/**
	 * 为seajs定义接口支持
	 */
	if (typeof define === "function" && define.cmd) {
		define(function(require, exports, module) {
			module.exports.r4 = _jBase;
		});
	}

})(window);