/**
 * Created by hongshan.liu on 2016/12/27.
 */
var express = require('express');
var api = require('../common/api');
var util = require('../common/util');
var router = express.Router();
var captcha = require('../common/captcha');

exports.requestMapping = '/about';

/**
 * 关于我们
 */
router.get('/', function (req, res, next) {
    res.render('about/about');
});

/**
 * 公司介绍
 */
router.get('/company', function (req, res, next) {
    res.render('about/company');
});

/**
 * 助微贷介绍
 */
router.get('/app', function (req, res, next) {
    res.render('about/app');
});

/**
 * 关于我们首页
 */
router.get('/index', function (req, res, next) {
    res.render('about/about');
});

router.get('/img', function (req, res, next) {
    var img = captcha.generate({
        text:"1934"
    });
    var imgbase64 = new Buffer(img,'base64');
    res.writeHead(200, {
        'Content-Type': 'image/png'
    });
    res.end(imgbase64);
    // var str = '<img src='+imgbase64+'>'
    // res.send(str)
});

exports.router = router;
