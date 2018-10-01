// let mysql = require('mysql');

// let db;

// function connectDatabase() {
// 	if (!db) {
// 		db = mysql.createConnection({
// 			host: config.host,
// 			user: config.user,
// 			password: config.password,
// 			database: config.database
// 		});

// 		db.connect(function (err) {
// 			if (!err) {
// 				console.log('Database is connected!');
// 			} else {
// 				console.log('Error connecting database!');
// 			}
// 		});
// 	}
// 	return db;
// }
let config = require('./config');
module.exports = require('node-querybuilder').QueryBuilder(config, 'mysql', 'pool');
