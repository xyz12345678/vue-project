/**
 * Created by hongshan.liu on 2017/5/26.
 */
var express = require('express');
var api = require('../common/api');
var util = require('../common/util');
var router = express.Router();

exports.requestMapping = '/draw';

/**
 * 抽奖活动页面
 */
router.get('/index', function (req, res, next) {
    res.render('draw/index');
});

exports.router = router;
