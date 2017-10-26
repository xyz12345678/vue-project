var util = require('../common/util');
var pkg = require('../package.json');

// 默认配置
var defaultConfig = {
    project: {
        port: '4001', // 项目端口
        name: pkg.name, // 项目名称，用于打包等
        version: pkg.version, // 项目版本
    },
    log: {
        path: './', // 日志路径
        type: 'console',// 日志打印类型：console、fileLog、dateFileLog
        level: 'all', // 日志打印级别：all、trace、debug、info、warn、error、fatal
    },
    api: {
        newCashLoan: {
            // 本地联调
            // url: 'http://10.16.80.105:8092',
            // url: 'http://10.16.65.86:8092',
            // url: 'http://10.16.66.83:8092',
            // 测试
            url: 'http://zwlapi18.msxf.lotest'
        },
        versionUpdate: {
            url: 'http://icms2.msxf.lotest',
        },
        draw: {
            url: 'http://10.250.120.24:8003', // 抽奖活动地址
        }
    },
    redisNodes: []
};

// 启动配置，部署环境变量：dev、test、uat、online
var startupConfig = process.env.CFG_PATH || ('./config-' + (process.env.NODE_ENV || 'dev'));
// 获取环境配置
var config = {};
try {console.log('启动配置文件：%s', startupConfig);config = require(startupConfig);} catch(e) {console.error('未找到启动配置：%s', startupConfig)};
// 获取当前部署环境对应配置
config = util.extend(true, {}, defaultConfig, config || {});

module.exports = config;
