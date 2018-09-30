const express = require('express');
const uuid = require('uuid/v4');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
let helpers = require('../_helpers');

let db = require('../db');
const SECRET = 'ilovealyona15031996VERYMUCH'

function createHash(pass) {
	let cipher = crypto.createCipher('aes-128-cbc', pass);
	let hash = cipher.update(SECRET, 'utf8', 'hex')
	hash += cipher.final('hex');
	return hash;
}
let router = express.Router();
router.get('/', function (req, res) {
	res.write("HELLO!")
})
router.get('/:id', helpers.verifyToken, function (req, res) {
	let { id } = req.params;
	jwt.verify(req.token, SECRET, function (err, decoded) {
		if (err)
			res.sendStatus(404);
		if (id === decoded.user.id) {
			let query = `SELECT *
									 FROM users
									 WHERE id=?`;
			db.query(query, [id], function (err, result) {
				if (err) throw err;
				let user = result[0];
				res.json(user)
			});
		} else {
			res.sendStatus(403);
		}
	})
});
router.patch('/:id', helpers.verifyToken, function (req, res) {
	let { id } = req.params;
	let { about, imageURL, password } = req.body;
	let hash = createHash(password);
	jwt.verify(req.token, SECRET, function (error, decoded) {
		if (id === decoded.id) {
			let query = `UPDATE users
			SET \`password\`=?,
					\`image\`=?,
					\`about\`=?
			WHERE id=?`;
			db.query(query, [hash, imageURL, about, id], function (err, result) {
				if (err) throw err;
				res.send('Changes applied');
			});
		} else {
			res.sendStatus(403);
		}
	})
});
router.post('/login', function (req, res) {
	console.log('IM IN LOGIN2')
	setTimeout(function () {
		let { email, password } = req.body;
		let hash = createHash(password);
		let query =
			`SELECT id, first_name, last_name
			FROM users
			WHERE email=? AND password=?`;
		db.query(query, [email, hash], function (err, result) {
			if (err)
				res.sendStatus(404);
			if (result.length > 0) {
				let user = result[0];
				console.log(user.id)
				jwt.sign({ user }, SECRET, (err, token) => {
					if (err) res.sendStatus(403);
					res.json({
						id: user.id,
						token: token
					});
				})
			} else {
				res.sendStatus(404)
			}
		});
	}, 3000)
});

router.post('/signup', function (req, res) {
	let { first_name, last_name, email, password1, password2 } = req.body;
	if (first_name && last_name && email &&
		password1 && password2 && (password1 === password2)) {
	}
	let hash = createHash(password1);
	let promise = new Promise((resolve, reject) => {
		db.query(`SELECT * FROM users WHERE email=?`, [email], function (err, result) {
			if (err) return reject(err);
			resolve(result.length);
		});
	});
	promise.then((length) => {
		if (length < 1) {
			let query = `INSERT INTO users(id, first_name, last_name, added, password, email)
									 VALUES (?,?,?,?,?,?)`;
			db.query(query, [
				uuid(),
				first_name,
				last_name,
				Date.now(),
				hash,
				email
			], function (err, result) {
				if (err) throw err;
				return res.sendStatus(201);
			});
		} else {
			return res.sendStatus(404);
		}
	});
});


module.exports = router;
