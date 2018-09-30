let mysql = require('mysql');
let config = require('./config');
let db;

function connectDatabase() {
	if (!db) {
		db = mysql.createConnection({
			host: config.host,
			user: config.user,
			password: config.password,
			database: config.database
		});

		db.connect(function(err) {
			if (!err) {
				console.log('Database is connected!');
			} else {
				console.log('Error connecting database!');
			}
		});
	}
	return db;
}

module.exports = connectDatabase();
