/**
 * Created by hongshan.liu on 2016/11/17.
 */
var express = require('express');
var api = require('../common/api');
var util = require('../common/util');
var router = express.Router();

exports.requestMapping = '/antiFraud';

/**
 * 反欺诈问题根目录显示-index
 */
router.get('/', function (req, res, next) {
    // res.cookie('applicationid', req.headers['x-application-id']);
    // res.cookie('token', req.headers['x-token']);
    // res.cookie('clientinfo', req.headers['x-client']);
    // res.cookie('apiversion', req.headers['x-api-version']);

    var xClient = req.headers['x-client'];
    var appSystemVersion = '',
        appVersion = '';

    if ( xClient && req.headers['x-application-id'] == 'MS_IOS_NEW' ) {
        var arrClients = xClient.toString().split('; ');
        appSystemVersion = arrClients[1].toString().split('.')[0];
        appVersion = arrClients[3].toString();
    }
    var param = {
        dynamic_data: JSON.stringify(decodeURIComponent(req.headers['dynamic-form'])),
        app_sys_version: appSystemVersion,
        app_version: appVersion
    }
    LOG.info("dynamic-form"+decodeURIComponent(req.headers['dynamic-form']));
    // LOG.info('0000000000invitationResult22222  '+JSON.stringify(req.headers)+'*******'+JSON.stringify(req.session));
    // var token = req.headers['x-token'] || req.query[SESSION_STORE.token];
    //
    // if ( token !== '' &&  req.session[SESSION_STORE.token] === 'token' ) {
    //     req.session[SESSION_STORE.token] = req.headers['x-token'];
    //     req.session[SESSION_STORE.apiversion] = req.headers['x-api-version'];
    //     req.session[SESSION_STORE.clientinfo] = req.headers['x-client'];
    //     req.session[SESSION_STORE.applicationid] = req.headers['x-application-id'];
    //     // LOG.info('111111  '+JSON.stringify(req.session));
    // }
    // Redis.save(req,res,function(){
        res.render('anti_fraud/index', param);
    // });
});

exports.router = router;
