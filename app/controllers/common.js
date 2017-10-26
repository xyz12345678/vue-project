var express = require('express');
var router = express.Router();
var util = require('../common/util');

exports.requestMapping = '/common';

router.get('/success', function (req, res, next) {
    var data = {
        title: '成功',
        message: '操作成功'
    };
    res.render('common/success', util.extend(data, req.query || {}));
});

router.get('/error', function (req, res, next) {
    var data = {
        title: '系统异常',
        code: '系统异常',
        message: '对不起，系统异常，请稍候再试',
    };
    res.render('common/error', util.extend(data, req.query || {}));
});

router.all('/logger/:type', function (req, res, next) {
    var type = req.params.type,
        message = req.param('message');
    // 判断是否存在对应方法
    if (typeof LOG[type] == 'function') {
        LOG[type](message);
    }
    res.json({success: true});
});

router.get('/download', function (req, res, next) {
    res.render('common/download', req.query || {});
});

router.get('/protocol', function (req, res, next) {
    res.render('common/protocol', req.query || {});
});

router.get('/protocol_login', function (req, res, next) {
    res.render('common/protocol_login', req.query || {});
});

exports.router = router;
