/**
 * Created by jie.ding on 2016/4/23.
 */

var _ = require('lodash'),
	path = require('path'),
	queryString = require('querystring'),
	request = require('request');

/**
 * 判断当前是否为ajax请求
 * @param req
 * @returns {boolean}
 */
exports.isAjaxRequest = function(req) {
	var requestType = req.headers['X-Requested-With'] || req.headers['x-requested-with'];
	return null != requestType && "XMLHttpRequest" == requestType;
};

/**
 * 获得一个自定义异常
 * @param data      api返回数据
 * @param errMsg    默认错误信息
 */
exports.getDefError = function(data, errMsg) {
    var err = new Error(data.errorMsg || errMsg || '对不起，系统异常，请稍候再试~');
    this.extend(err, data);
    err.code = 'ERROR';
    return err;
};

/**
 * 判断当前是否为ajax请求
 * @param req
 * @returns {boolean}
 */
exports.isSuccess = function(data) {
    return data && data.errorCode == 0;
};

/**
 * 判断当前是否未登录
 * @param req
 * @returns {boolean}
 */
exports.isNonLogin = function(data) {
    return data && data.errorCode == '40011007';
};

/**
 * 判断当前是否有在途申请单
 * @param req
 * @returns {boolean}
 */
exports.isApplying = function(data) {
    return data && data.errorCode == '40083015';
};

/**
 * 根据request对象获得完整请求路径
 * @param req
 * @returns {string}
 */
exports.getFullUrl = function(req) {
	return req.protocol + '://' + req.headers.host + req.originalUrl;
};

/**
 * 根据request对象获得完整请求路径
 * @param req
 * @returns {string}
 */
exports.parseString = function(string, params) {
    for (var key in params) {
        var reg = new RegExp('\\{' + key + '\\}', 'gm');
        string = string.replace(reg, params[key]);
    }
    return string;
};

/**
 * 追加contextPath
 * @param url	请求地址
 */
exports.appendContextPath = function(url) {
	var fullPath = __CONTEXT_PATH + url;
	if (/\/$/.test(__CONTEXT_PATH) && /^\//.test(url)) { // 判断是否存在两个“/”重叠的情况
		fullPath = __CONTEXT_PATH.replace(/\/$/, '') + url;
	} else if (!/\/$/.test(__CONTEXT_PATH) && !/^\//.test(url)) {
		fullPath = __CONTEXT_PATH + '/' + url;
	}
	return fullPath;
};

/**
 * 设置url请求路径以“/”结尾
 * @param url	请求地址
 */
exports.urlEndFormat = function(url) {
	return _.isEmpty(url) ? '/' : (url + (/\/$/.test(url) ? '' : '/'));
};

// 对象合并，继承
var hasOwn = Object.prototype.hasOwnProperty;
var toStr = Object.prototype.toString;

var isArray = function isArray(arr) {
	if (typeof Array.isArray === 'function') {
		return Array.isArray(arr);
	}

	return toStr.call(arr) === '[object Array]';
};

var isPlainObject = function isPlainObject(obj) {
	if (!obj || toStr.call(obj) !== '[object Object]') {
		return false;
	}

	var hasOwnConstructor = hasOwn.call(obj, 'constructor');
	var hasIsPrototypeOf = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, 'isPrototypeOf');
	// Not own constructor property must be Object
	if (obj.constructor && !hasOwnConstructor && !hasIsPrototypeOf) {
		return false;
	}

	// Own properties are enumerated firstly, so to speed up,
	// if last one is own, then all properties are own.
	var key;
	for (key in obj) {/**/}

	return typeof key === 'undefined' || hasOwn.call(obj, key);
};

exports.extend = function extend() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0],
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if (typeof target === 'boolean') {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	} else if ((typeof target !== 'object' && typeof target !== 'function') || target == null) {
		target = {};
	}

	for (; i < length; ++i) {
		options = arguments[i];
		// Only deal with non-null/undefined values
		if (options != null) {
			// Extend the base object
			for (name in options) {
				src = target[name];
				copy = options[name];

				// Prevent never-ending loop
				if (target !== copy) {
					// Recurse if we're merging plain objects or arrays
					if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
						if (copyIsArray) {
							copyIsArray = false;
							clone = src && isArray(src) ? src : [];
						} else {
							clone = src && isPlainObject(src) ? src : {};
						}

						// Never move original objects, clone them
						target[name] = extend(deep, clone, copy);

						// Don't bring in undefined values
					} else if (typeof copy !== 'undefined') {
						target[name] = copy;
					}
				}
			}
		}
	}

	// Return the modified object
	return target;
};