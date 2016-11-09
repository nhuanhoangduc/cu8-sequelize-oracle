'use strict';

var Pooling = require('generic-pool'),
    Promise = require('../../promise'),
    _ = require('lodash'),
    defaultPoolingConfig = {
        max: 5,
        min: 0,
        idle: 10000,
        handleDisconnects: true
    },
    ConnectionManager;

ConnectionManager = function(dialect, sequelize) {
    var config = sequelize.config;

    this.sequelize = sequelize;
    this.config = config;
    this.dialect = dialect;

    if (config.pool) {
        config.pool = _.clone(config.pool); // Make sure we don't modify the existing config object (user might re-use it)
        config.pool = _.defaults(config.pool, defaultPoolingConfig, {
            validate: this.$validate.bind(this)
        });
    } else {
        // If the user has turned off pooling we provide a 0/1 pool for backwards compat
        config.pool = _.defaults({
            max: 1,
            min: 0
        }, defaultPoolingConfig, {
            validate: this.$validate.bind(this)
        });
    }

    // Map old names
    if (config.pool.maxIdleTime) config.pool.idle = config.pool.maxIdleTime;
    if (config.pool.maxConnections) config.pool.max = config.pool.maxConnections;
    if (config.pool.minConnections) config.pool.min = config.pool.minConnections;

    this.onProcessExit = this.onProcessExit.bind(this); // Save a reference to the bound version so we can remove it with removeListener
    process.on('exit', this.onProcessExit);
};

ConnectionManager.prototype.onProcessExit = function() {
    var self = this;

    if (this.pool) {
        this.pool.terminate();
    }
};

ConnectionManager.prototype.close = function() {
    this.onProcessExit();
    process.removeListener('exit', this.onProcessExit); // Remove the listener, so all references to this instance can be garbage collected.

    this.getConnection = function() {
        return Promise.reject(new Error('ConnectionManager.getConnection was called after the connection manager was closed!'));
    };
};

// This cannot happen in the constructor because the user can specify a min. number of connections to have in the pool
// If he does this, generic-pool will try to call connect before the dialect-specific connection manager has been correctly set up
ConnectionManager.prototype.initPools = function(sequelize) {
    let _this = this;
    let config = sequelize.config;

    let connectionConfig = {
        user: config.username,
        password: config.password
    };

    if (config.database && config.database.indexOf('DESCRIPTION=') >= 0) {
        connectionConfig.connectString = config.database;
    } else {
        connectionConfig.connectString = '//' + config.host + ':' + config.port + '/' + config.database;
    }

    connectionConfig.poolMax = 20;
    connectionConfig.poolMin = 0;
    connectionConfig.poolTimeout = 69;
    connectionConfig.queueRequests = true;
    // connectionConfig._enableStats = true;

    _this.lib.createPool(connectionConfig, (err, pool) => {
        if (err) {
            throw new Error(err);
        }

        _this.pool = pool;
    });
};

ConnectionManager.prototype.getConnection = function(options) {
    var self = this;
    options = options || {};
    // this.pool._logStats();
    
    return new Promise(function(resolve, reject) {
        self.pool.getConnection((err, connection) => {
            if (err) {
                reject(new sequelizeErrors.ConnectionError(err));
                return;
            }

            resolve(connection);
        });
    });
};
ConnectionManager.prototype.releaseConnection = function(connection) {
    var self = this;

    return new Promise(function(resolve, reject) {
        connection.release(function(err) {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};

ConnectionManager.prototype.$connect = function(config) {
    return this.dialect.connectionManager.connect(config);
};
ConnectionManager.prototype.$disconnect = function(connection) {
    return this.dialect.connectionManager.disconnect(connection);
};

ConnectionManager.prototype.$validate = function(connection) {
    return Promise.resolve();
};

module.exports = ConnectionManager;