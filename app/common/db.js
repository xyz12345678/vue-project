/**
 * Created by jie.ding on 2016/4/23.
 */

var mysql = require('mysql');

// 创建mysql连接池
var pool = mysql.createPool(CONFIG.db);

/**
 * 执行sql语句
 * @param options   sql执行参数
 *          {
 *              sql: '',
 *              params: '',
 *              callback: function(err, result) {}
 *          }
 */
exports.executeSQL = function(options) {
    // 获得连接
    pool.getConnection(function(err, conn) {
        var callback = options.callback;
        if (typeof callback != 'function') {
            callback = function() {};
        }
        if (err) {
            LOG.error(err);
            callback(err);
            return;
        }
        // 执行sql
        conn.query(options.sql, options.params || '', function(err, result) {
            // 释放连接
            conn.release();
            // 打印异常日志
            if (err) {
                LOG.error(err);
            }
            // sql执行完毕处理
            callback(err, result);
        });
    });
};