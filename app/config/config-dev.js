module.exports = {
	api: {
        newCashLoan: {
            // 本地联调
            // url: 'http://10.16.80.105:8092'
            // 测试
            url: 'http://zwlapi18.msxf.lotest/',
            // url: 'http://10.16.65.86:8092',
            // url: 'http://10.16.66.83:8092',
        },
        versionUpdate: {
            url: 'http://icms2.msxf.lotest'
        },
        draw: {
            // url: 'http://10.16.30.152:16080' // 抽奖活动地址
            // url: 'http://172.17.1.103:8091'
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
