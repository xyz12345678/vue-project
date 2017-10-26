var express = require('express');
var api = require('../common/api');
var util = require('../common/util');
var router = express.Router();

exports.requestMapping = '/apply';

/**
 * 申请贷款页面-index
 */
router.get('/', function (req, res, next) {
    res.render('apply/apply');
});

exports.router = router;
