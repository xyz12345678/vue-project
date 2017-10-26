var express = require('express'),
	path = require('path'),
	favicon = require('serve-favicon'),
	logger = require('morgan'),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser'),
    compression = require('compression'),
    session = require('express-session'),
	ejs = require('ejs'),
	log = require('./log'),
    filter = require('./filter'),
	router = require('./router'),
	util = require('./common/util');

// 全局请求地址前缀
global.__CONTEXT_PATH = '/';
// 日志对象
global.LOG = log.logger;
// 系统配置
global.CONFIG = require('./config/config');
// redis集群对象
// global.Redis = require('./common/redis-session');
// session登录标志
global.SESSION_STORE = {
    OPEN_ID: 'openId',		    // 用户支付宝userId
    UNIQUE_ID: 'uniqueId',	    // 马上用户id
    CACHE: 'cache',	            // 缓存信息
    token: 'token',
    apiversion: 'apiversion',
    clientinfo: 'clientinfo',
    applicationid: 'applicationid'
};

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', ejs.__express);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'favicon.ico')));
// 设置日志打印级别
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compression({filter: shouldCompress}));
function shouldCompress (req, res) {
    var originalUrl = req.originalUrl;
    if (/\/css\/([\w\W]+)(\.css)/.test(originalUrl) || /\/js\/([\w\W]+)(\.js)/.test(originalUrl)) {
        return true;
    }
    return compression.filter(req, res)
}
app.use(express.static(path.join(__dirname, 'dist')));

// 设置session
// app.use(global.Redis());
app.use(session({
    secret: 'recommand 128 bytes random string', // 建议使用 128 个字符的随机字符串
    cookie: { maxAge: 60 * 1000 }
}));

// 全局参数设置
app.use(function(req, res, next) {
    // 设置不允许缓存
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", 0);
    res.locals.contextPath = __CONTEXT_PATH;
    next();
});

// 设置日志记录
log.use(app);
// 请求拦截器
filter(app);
// 加载系统路由
router(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	var err = new Error('ERROR NO PAGE FOUND');
	err.status = 404;
	next(err);
});

// error handlers
app.use(function (err, req, res, next) {
	LOG.error(err);

    var code = err.code || err.status || 500;
    var message = err.message || err.stack || '对不起，系统异常，请稍候再试~';
    if (/TIMEDOUT/i.test(code) || err.syscall == 'connect' || err.hasOwnProperty('connect')) {
        code = '网络异常';
        message = '网络异常，请稍候再试~';
    } else if (code != 404 && code != 'ERROR') {
        code = '系统异常';
        message = '对不起，系统异常，请稍候再试~';
    }

	// 返回数据
	var params = {
		title: err.title || code,
		code: code,
		message: message,
        errorCode: err.errorCode || code,
        errorMsg: err.errorMsg || message
    };

	try {
		if (util.isAjaxRequest(req)) {
			res.send(params);
		} else {
            if (util.isNonLogin(err)) { // 未登录
                res.redirect(util.appendContextPath('login?r=' + util.getFullUrl(req)));
            } else if (util.isApplying(err)) { // 在途申请单
                var id = err.errorMsg || '';
                res.redirect(util.appendContextPath('loan/status?id=' + id));
            } else { // 其他异常
                res.render('common/error', params);
            }
		}
	} catch (e) {
		// ignore
	}
});

// 未捕获异常日志
process.on('uncaughtException', function (err) {
    LOG.error(err);
});

module.exports = app;
