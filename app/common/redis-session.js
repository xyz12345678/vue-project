var config = {
    SECRET: 'sessionsecret',
    session_key: 'newmsdsid',
    maxAge: 24 * 60 * 60,
    expires: 24 * 60 * 60 * 1000,
    path: "/",
    httpOnly: true
};
var crypto = require('crypto');
var Redis = require('ioredis');
var util = require('./util');
// 创建redis集群
var redisCluster = new Redis.Cluster(CONFIG.redisNodes);
var notConn = false;
redisCluster.on('error', function (err) {
    LOG.error('redisCluster error');
    LOG.error(err);
    notConn = true;
});
redisCluster.on('connect', function (err) {
    LOG.info('redisCluster connect');
    notConn = false;
});

var sessionIdKeyPrefix = 'newmsd-';
var sign = function (val, secret) {
    return val + '.' + crypto
            .createHmac('sha1', secret)
            .update(val)
            .digest('base64')
            .replace(/[\/\+=]/g, '');
};
var generate = function (id) {
    var session = {};
    if (id) {
        session.id = id;
    } else {
        session.id = (new Date()).getTime() + Math.random().toString();
        session.id = sessionIdKeyPrefix + sign(session.id, config.SECRET);
    }
    session.expire = (new Date()).getTime() + config.expires;
    return session;
};
var writeHead = function (req, res) {
    var cookies = res.getHeader('Set-Cookie');
    cookies = cookies || [];
    var session = serialize(config.session_key, req.session.id, config);
    cookies = Array.isArray(cookies) ? cookies.concat(session) : [cookies, session];
    res.setHeader('Set-Cookie', cookies);
};
var serialize = function (name, val, opt) {
    var pairs = [name + '=' + encodeURIComponent(val)];
    opt = opt || {};
    if (opt.maxAge) pairs.push('Max-Age=' + opt.maxAge);
    if (opt.domain) pairs.push('Domain=' + opt.domain);
    if (opt.path) pairs.push('Path=' + opt.path);
    if (opt.expires) pairs.push('Expires=' + opt.expires);
    if (opt.httpOnly) pairs.push('HttpOnly');
    if (opt.secure) pairs.push('Secure');
    return pairs.join('; ');
};

module.exports = function session(options) {
    util.extend(config, options || {});
    return function session(req, res, next) {
        var id = req.cookies[config.session_key];
        if (!id) {
            req.session = generate();
            next();
        } else if (notConn) {
            if (!req.session) {
                req.session = generate(id);
            }
            next();
        } else {
            redisCluster.hget(id, 'session', function (err, reply) {
                if (err) {
                    LOG.error(err);
                }
                if (reply) {
                    var session = JSON.parse(reply);
                    if (session.expire > (new Date()).getTime()) {
                        session.expire = (new Date()).getTime() + config.expires;
                        req.session = session;
                        return next();
                    }
                }
                redisCluster.hdel(id, 'session');
                req.session = generate();
                next();
            });
        }
    };
};

module.exports.save = function (req, res, callback) {
    if (notConn) {
        if (callback) {
            callback();
        }
        return false;
    }
    var id = req.session.id;
    if (!id) {
        if (callback) {
            callback();
        }
        return false;
    }
    var json = JSON.stringify(req.session);
    redisCluster.hset(id, 'session', json,
        function (err, reply) {
            if (err) {
                LOG.error('session save error');
                LOG.error(err);
            } else {
                redisCluster.expire(id, config.maxAge, function (err) {
                    if (err) {
                        LOG.error('redis expire error');
                        LOG.error(err);
                    }
                });
            }
            writeHead(req, res);
            if (callback) {
                callback(err);
            }
        });
};

module.exports.Cluster = redisCluster;