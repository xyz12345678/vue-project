module.exports = {
	project: {
		name: 'ncl.msxf.lotest',							// 项目名称
	},
	log: {
		type: 'fileLog',								    // 日志打印类型：console、fileLog、dateFileLog
		level: 'info'										// 日志打印级别：all、trace、debug、info、warn、error、fatal
	},
	api: {
        newCashLoan: {
            url: 'http://zwlapi18.msxf.lotest'			// 服务地址
        },
        versionUpdate: {
            url: 'http://icms2.msxf.lotest'
        },
        draw: {
            // url: 'http://lotteryapi.msxf.lotest' // 抽奖活动地址
            url: 'http://10.250.120.24:8003' // 抽奖活动地址
        }
	},
    redisNodes: [
        {"port":"7000","host":"192.168.2.210"},
        {"port":"7001","host":"192.168.2.210"},
        {"port":"7002","host":"192.168.2.210"},
        {"port":"7003","host":"192.168.2.210"},
        {"port":"7004","host":"192.168.2.210"},
        {"port":"7005","host":"192.168.2.210"}
    ]
};
