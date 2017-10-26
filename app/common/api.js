var queryString = require('querystring');
var httpRequest = require('request');
var _ = require('lodash');
var moment = require('moment');
var url = require('url');
var util = require('./util');

// 获得助微贷后台api服务配置地址
var newCashLoanApiHost = util.urlEndFormat(CONFIG.api.newCashLoan.url);
// 获得版本检测的服务地址
var versionUpdateHost = util.urlEndFormat(CONFIG.api.versionUpdate.url);
// 获取抽奖活动地址
var drawHost = util.urlEndFormat(CONFIG.api.draw.url);

// api服务注册
var services = {
    // 助微贷
    newCashLoan : {
        // 动态表单及反欺诈问题的流程流转
        flowApply: newCashLoanApiHost+ 'zwlapi/apply/v1/dynamic_submit',
        flowApplyv1: newCashLoanApiHost+ 'zwlapi/apply/v1/dynamic_submit',
        flowApplyv2: newCashLoanApiHost+ 'zwlapi/apply/v2/dynamic_submit',
        // 获取短信验证码
        getSms: newCashLoanApiHost+ 'zwlapi/sms/v2/captcha',
        // 根据活动ID获取活动详情
        getActivityDetail: newCashLoanApiHost+ 'zwlapi/activity/v2/activity_detail',
        // 获取某个活动的邀请码
        getActivityInvitationCode: newCashLoanApiHost+ 'zwlapi/activity/v2/invitation_code',
        // 获取活动邀请记录及奖励记录
        getActivityResult: newCashLoanApiHost+ 'zwlapi/activity/v2/invitation_code/result',
        // 获取寿险协议
        getLifeInsurance: newCashLoanApiHost+'zwlapi/pages/v1/insurance_h5',
        // 获取注册协议
        getRegisterRule: newCashLoanApiHost+ 'zwlapi/pages/v1/regist_h5',
        // 授权协议
        getGrantRule: newCashLoanApiHost+ 'zwlapi/pages/v1/shd_grant_h5',
        //  用户注册
        register: newCashLoanApiHost+ 'zwlapi/user/v2/regist',
        // 检测邀请码是否有效
        validateInvitationCode: newCashLoanApiHost+ 'zwlapi/activity/v2/invitation_code_check',
        getLoanData: newCashLoanApiHost+'zwlapi/loan/v1/loan_data',
        getStagingData: newCashLoanApiHost+'zwlapi/loan/v1/installment',
    },
    // 版本检测
    versionUpdate: {
        // 安卓版本检测
        android: versionUpdateHost+'update/getLatestApk'
    },
    // 广告抽奖
    draw: {
        // 检测是否可以抽奖
        isDraw: newCashLoanApiHost+'zwlapi/adv/v2/screen_award_customer',
        // 抽奖
        goDraw: drawHost+'lottery/receivelottery'
    }

};
exports.services = services;

// 服务对应固定参数
var servicesParams = {
    // 助微贷
    newCashLoan: {

    }
};
exports.servicesParams = servicesParams;

/**
 * 发送请求
 * @param serviceUrl    	服务地址
 * @param req            	请求request对象
 * @param callback        	请求成功回调函数
 * @param errorCallback    	请求异常回调函数
 * @param completeCallback	请求完成回调函数
 */
exports.request = function (serviceUrl, req, callback, errorCallback, completeCallback) {
    // 请求发送开始时间
    var _startTime = moment().format('MM-DD HH:mm:ss.SSS');
    var method = req.method.toUpperCase();
    var contentType = (req.headers && req.headers['content-type']) ? req.headers['content-type'] : 'application/x-www-form-urlencoded;charset=UTF-8' || 'application/x-www-form-urlencoded;charset=UTF-8';

    if (method == 'GET') {
        serviceUrl = util.parseString(serviceUrl, req.query || {});
    } else {
        serviceUrl = util.parseString(serviceUrl, req.body || {});
    }

    if (method == 'GET' && !_.isEmpty(req.query)) {
        serviceUrl += (/\?/.test(serviceUrl) ? '&' : '?') + queryString.stringify(req.query);
    }
     // LOG.info('22222222222222  '+JSON.stringify(req.session));

    // LOG.info('22222222222222  '+JSON.stringify(req.cookies));
    // var apiversions = req.session[SESSION_STORE.apiversion] || '1';
    // var applicationids = req.session[SESSION_STORE.applicationid] ||  'MS_ANDROID_NEW';
    // var clientinfos = req.session[SESSION_STORE.clientinfo] || 'AndroidNMS%3B+6.0.1%3B+msxf%3B+21301%3B+Xiaomi%3B+Xiaomi%3B+Redmi+3S%3B+MMB29M%3B+%3B+0.000000%2C0.000000%3B+1%3B+172.17.3.238%3B+38%3AA4%3AED%3A11%3AE2%3A58';
    // var tokens = req.session[SESSION_STORE.token] ||  '';
    // var defaultClientInfo = encodeURIComponent('H5NMS; 2.2.0; H5NMS; 220; dddd; H5NMS; H5NMS; H5NMS; 0 ;0,0; 1; 0.0.0.0; 0.0.0.0');
    var defaultClientInfo = encodeURIComponent('H5ZWL;;;;;;;;;;;;');
    var apiversions = req.headers.appversion || '1';
    var applicationids = req.headers.xapplicationid || 'H5ZWL';
    var clientInfo = decodeURIComponent(req.headers.xclient || defaultClientInfo);
    var token = req.headers.xtoken || '';

    var options = {
        timeout: 30000,
        pool: false,
        method: method,
        url: serviceUrl,
        headers: {
            'content-type': contentType,
            'X-API-Version': apiversions,
            'X-Application-Id': applicationids,
            'X-Client': clientInfo,
            'X-OpenId': req.session[SESSION_STORE.OPEN_ID] || '',
            'X-Token': token,
        },
    };

    if (method != 'GET' && !_.isEmpty(req.body)) {
        if (/form-data/.test(contentType)) {
            options.formData = req.body;
        } else if (/form/.test(contentType)) {
            options.form = req.body;
        } else {
            options.body = JSON.stringify(req.body);
        }
    }

    callback = callback || function () {};
    errorCallback = errorCallback || function () {};
    completeCallback = completeCallback || function () {};
    return httpRequest(options, function (error, httpResponse, body) {
        LOG.info(JSON.stringify(options.headers));
        LOG.trace('req type：%s, start time：[%s], res time：[%s] url：%s', method, _startTime, moment().format('MM-DD HH:mm:ss.SSS'), serviceUrl);
        LOG.info(body);

        if (method != 'GET') {
            LOG.info(JSON.stringify(req.body || {}));
        }
        if (error == null) {
            var statusCode = httpResponse.statusCode;

            if (/^2/.test('' + statusCode)) { // Status Codes other than 2xx
                var contentType = httpResponse.headers['content-type'];
                if (/application\/json/i.test(contentType)) {
                    if (body == null) {
                        body = {};
                    } else if (typeof body === 'string'){
                        if (/<body[^>]*>([\s\S.]*)<\/body>/i.test(body)) {

                        } else {
                            body = JSON.parse(body);
                        }
                    }
                }
                callback(httpResponse, body);
            } else {
                error = new Error(_.get(httpResponse, 'statusMessage'));
                error.status = statusCode;
            }
        }
        if (error) {
            errorCallback(error);
        }
        completeCallback(error, httpResponse, body);
    });
};
