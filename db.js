let config = require('./config');
module.exports = require('node-querybuilder').QueryBuilder(config, 'mysql', 'pool');
