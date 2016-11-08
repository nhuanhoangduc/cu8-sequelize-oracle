'use strict';

var AbstractConnectionManager = require('../abstract/connection-manager'),
    ConnectionManager, Utils = require('../../utils'),
    Promise = require('../../promise'),
    sequelizeErrors = require('../../errors');

ConnectionManager = function(dialect, sequelize) {
    AbstractConnectionManager.call(this, dialect, sequelize);

    this.sequelize = sequelize;
    this.sequelize.config.port = this.sequelize.config.port || 1521;

    try {
        this.lib = require(sequelize.config.dialectModulePath || 'oracledb');
    } catch (err) {
        throw new Error('Please install oracledb package manually');
    }
};

Utils._.extend(ConnectionManager.prototype, AbstractConnectionManager.prototype);

ConnectionManager.prototype.connect = function(config) {
    var self = this;

    return new Promise(function(resolve, reject) {
        self.pool.getConnection((err, connection) => {
            if (err) {
                reject(new sequelizeErrors.ConnectionError(err));
                return;
            }

            resolve(connection);
        });
    }).timeout(1980, 'Error: timeout of 2000ms exceeded. Check your configuration and your database.');
};

ConnectionManager.prototype.disconnect = function(connection) {
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

ConnectionManager.prototype.validate = function(connection) {
    return true;
};

module.exports = ConnectionManager;