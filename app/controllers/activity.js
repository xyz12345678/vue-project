/**
 * Created by hongshan.liu on 2017/3/31.
 */
var express = require('express');
var api = require('../common/api');
var util = require('../common/util');
var router = express.Router();

exports.requestMapping = '/activity';

/**
 * 邀请码详情
 */
router.get('/invitationDetail', function (req, res, next) {
    // LOG.info('0000000000invitationResult22222  '+JSON.stringify(req.headers)+'*******'+JSON.stringify(req.session));
    // LOG.info('00000023423   '+req.cookies.token);
    var token = req.cookies.token;//req.headers['x-token'] || req.query[SESSION_STORE.token];

    // if ( token !== '' &&  req.session[SESSION_STORE.token] === 'token' ) {
    // if ( !token ){
    //     // req.session[SESSION_STORE.token] = req.headers['x-token'];
    //     // req.session[SESSION_STORE.apiversion] = req.headers['x-api-version'];
    //     // req.session[SESSION_STORE.clientinfo] = req.headers['x-client'];
    //     // req.session[SESSION_STORE.applicationid] = req.headers['x-application-id'];
    //     // LOG.info('111111  '+JSON.stringify(req.session));
    //
    //     res.cookie('applicationid', req.headers['x-application-id']);
    //     res.cookie('token', req.headers['x-token']);
    //     res.cookie('clientinfo', req.headers['x-client']);
    //     res.cookie('apiversion', req.headers['x-api-version']);
    //     // LOG.info('111111  '+JSON.stringify(req.cookies));
    // }
    // Redis.save(req,res,function(){
        res.render('activity/invitation_detail');
    // });

});

/**
 * 邀请结果分享后展示页面
 */
router.get('/invitationResult', function (req, res, next) {
    // LOG.info('0000000000invitationResult22222  '+JSON.stringify(req.headers)+'*******'+JSON.stringify(req.session));
    // var token = req.headers['x-token'] || req.query[SESSION_STORE.token];
    //
    // if ( token !== '' &&  req.session[SESSION_STORE.token] === 'token' ) {
    //     req.session[SESSION_STORE.token] = req.headers['x-token'];
    //     req.session[SESSION_STORE.apiversion] = req.headers['x-api-version'];
    //     req.session[SESSION_STORE.clientinfo] = req.headers['x-client'];
    //     req.session[SESSION_STORE.applicationid] = req.headers['x-application-id'];
    //     // LOG.info('111111invitationResult  '+JSON.stringify(req.session));
    // }
    // Redis.save(req,res,function(){
        res.render('activity/invitation_result');
    // });

});

/**
 * 邀请规则
 */
router.get('/invitationRule', function (req, res, next) {
    res.render('activity/invitation_rule');
});

/**
 * 邀请分享页面
 */
router.get('/invitationShare', function (req, res, next) {
    res.render('activity/invitation_share');
});

/**
 * 优惠券说明
 */
router.get('/explain', function (req, res, next) {
    res.render('activity/explain');
});
exports.router = router;

