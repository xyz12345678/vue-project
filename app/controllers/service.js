var express = require('express');
var api = require('../common/api');
var util = require('../common/util');

var router = express.Router();

exports.requestMapping = '/services';

// 调用API服务
var apiService = function (req, res, next) {
    var platform = req.params.platform,
        service = req.params.service;
    // 是否提供平台服务
    if (api.services.hasOwnProperty(platform)) {
        var services = api.services[platform];
        // 平台是否提供相应服务
        if (services.hasOwnProperty(service)) {
            var url = services[service];
            // 是否配置了参数
            if (api.servicesParams.hasOwnProperty(platform) && api.servicesParams[platform].hasOwnProperty(service)) {
                var params = api.servicesParams[platform][service];
                var method = req.method.toUpperCase();
                if (method == 'GET') {
                    req.query = util.extend(true, req.query || {}, params);
                } else {
                    req.body = util.extend(true, req.body || {}, params);
                }
            }
            api.request(url, req, null, next).pipe(res, {end: true});
        } else {
            // 返回异常信息
            var err = new Error('ERROR NO SERVICE API FOUND ' + platform + '.' + service);
            err.status = 404;
            next(err);
        }
    } else {
        // 返回异常信息
        var err = new Error('ERROR NO SERVICE API FOUND ' + platform + '.' + service);
        err.status = 404;
        next(err);
    }
};
router.all('/:platform/:service', apiService);

// 调用API服务，后端固定参数
var apiServiceByParam = function (req, res, next) {
    var platform = req.params.platform,
        service = req.params.service,
        serviceParam = req.params.serviceParam;
    // 是否提供平台服务
    if (api.services.hasOwnProperty(platform)) {
        var services = api.services[platform];
        // 平台是否提供相应服务
        if (services.hasOwnProperty(service)) {
            var url = services[service];
            // 是否配置了参数
            if (api.servicesParams.hasOwnProperty(platform) && api.servicesParams[platform].hasOwnProperty(service)) {
                var params = api.servicesParams[platform][service];
                if (params.hasOwnProperty(serviceParam)) {
                    var serviceParams = params[serviceParam];
                    var method = req.method.toUpperCase();
                    if (method == 'GET') {
                        req.query = util.extend(true, req.query || {}, serviceParams);
                    } else {
                        req.body = util.extend(true, req.body || {}, serviceParams);
                    }
                }
            }
            api.request(url, req, null, next).pipe(res, {end: true});
        } else {
            // 返回异常信息
            var err = new Error('ERROR NO SERVICE API FOUND ' + platform + '.' + service);
            err.status = 404;
            next(err);
        }
    } else {
        // 返回异常信息
        var err = new Error('ERROR NO SERVICE API FOUND ' + platform + '.' + service);
        err.status = 404;
        next(err);
    }
};
router.all('/:platform/:service/:serviceParam', apiServiceByParam);

exports.router = router;