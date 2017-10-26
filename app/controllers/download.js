/**
 * Created by hongshan.liu on 2017/2/7.
 */
var express = require('express');
var api = require('../common/api');
var util = require('../common/util');
var router = express.Router();

exports.requestMapping = '/download';

/**
 * 下载主页
 */
router.get('/index', function (req, res, next) {
    res.render('download/index');
});

exports.router = router;
