const express = require('express');
const uuid = require('uuid/v4');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator/check');
const { sanitize } = require('express-validator/filter');
let helpers = require('../_helpers');
const constants = require('../_constants');

let router = express.Router();
const pool = require('../db');

router.get('/:id', helpers.verifyToken, (req, res) => {
	let { id } = req.params;
	if (id) {
		jwt.verify(req.token, constants.API_SECRET, (err, decoded) => {
			if (err)
				res.status(401).send({ message: messageConstants.NO_ACCESS });
			if (id === decoded.user.id) {
				pool.get_connection(qb => {
					qb.select('*')
						.where({ id: id })
						.get('users', (error, response) => {
							qb.release();
							if (error)
								res.status(404).send({ message: messageConstants.DB_ERROR });
							let user = response[0];
							res.json(user)
						})
				})
			} else {
				res.status(401).send({ message: messageConstants.NO_ACCESS })
			}
		})
	}
});

router.patch('/:id', helpers.verifyToken, (req, res) => {
	let { id } = req.params;
	let { about, imageURL, password, first_name, last_name } = req.body;
	let hash = helpers.createHash(password);
	jwt.verify(req.token, constants.API_SECRET, (err, decoded) => {
		if (err)
			res.sendStatus(404);
		if (id === decoded.id) {
			pool.get_connection(qb => {
				qb.set({
					first_name: first_name,
					last_name: last_name,
					about: about,
					imageURL: imageURL
				})
					.where({
						id: id
					})
					.update('users', (error, response) => {
						qb.release();
						if (error)
							res.sendStatus(500);
						res.sendStatus(203);
					});
			})
		} else {
			res.sendStatus(403);
		}
	})
});

router.post('/login',
	// Validation of incoming values
	[
		check('email')
			.not().isEmpty()
			.trim()
			.isEmail()
			.normalizeEmail(),
		check('password')
			.not().isEmpty()
			.trim()
	], (req, res) => {
		// If there are errors, then send a response back to client with error status
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json({ errors: errors.array() });
		}
		let { email, password } = req.body;
		// Create hash based on password
		let hash = helpers.createHash(password);
		// Getting connection
		pool.get_connection(qb => {
			// Making query to db
			qb.select(['id', 'first_name', 'last_name'])
				.where({ email: email, password: hash })
				.get('users', (err, response) => {
					qb.release();
					// If there are errors, then send a response back to client with error status
					if (err)
						res.status(404).send({ message: constants.WRONG_QUERY });
					// If query returns rows generate and send back access token
					// Query basically must return exactly one row if user exists
					if (response.length > 0) {
						let user = response[0];
						jwt.sign({ user }, constants.API_SECRET, (error, token) => {
							if (error)
								// If there are errors, then send a response back to client with error status
								res.status(401).send({ message: constants.NO_ACCESS })
							// Sending back access token and clientId
							res.json({
								id: user.id,
								token: token
							});
						})
					} else {
						// If there are errors, then send a response back to client with error status
						res.status(400).json({ message: constants.WRONG_CREDENTIALS })
					}
				}
				);
		});
	});

router.post('/signup',
	// Validation of incoming values
	[
		check('email')
			.not().isEmpty()
			.trim()
			.isEmail()
			.normalizeEmail(),
		check('password1')
			.not().isEmpty()
			.trim(),
		check('password2')
			.not().isEmpty()
			.trim()
			.custom((value, { req, loc, path }) => {
				if (value !== req.body.password1) {
					// Throw error if passwords do not match
					console.log("THE PASSWORD ARE NOT THE SAME")
					throw new Error("Passwords don't match");
				} else {
					return value;
				}
			}),
		check('first_name')
			.not().isEmpty()
			.trim(),
		check('last_name')
			.not().isEmpty()
			.trim(),
		sanitize(['first_name', 'last_name'])
	],
	(req, res) => {
		// If there are errors, then send a response back to client with error status
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			console.log("ERRORS IN VALIDATING")
			return res.status(422).json({ errors: errors.array() });
		}
		let { first_name, last_name, email, password1, password2 } = req.body;
		// Create hash based on password
		let hash = helpers.createHash(password1);
		// Create object to insert into table
		let objToInsert = {
			id: uuid(),
			first_name,
			last_name,
			added: Date.now(),
			password: hash,
			email
		};
		let promise = new Promise((resolve, reject) => {
			// Query the database to determine if the user with such an email already exists
			pool.get_connection(qb => {
				qb.select('*')
					.where({
						email: email
					})
					.get('users', (error, response) => {
						qb.release();
						if (error)
							res.status(404).send({ message: messageConstants.DB_ERROR });
						resolve(response.length);
					})
			})
		});
		promise
			.then((length) => {
				// If such an email is not already taken by another user
				if (length < 1) {
					// Query the database to insert new user
					pool.get_connection(qb => {
						qb.insert('users', objToInsert, (error, response) => {
							qb.release();
							if (error)
								// If there are errors, then send a response back to client with error status
								res.status(404).send({ message: messageConstants.DB_ERROR });
							// If everything is ok, then send back respond with status 201
							res.status(201).json(response[0]);
						})
					})
				} else {
					res.status(404).json({ message: constants.USER_EXIST })
				}
			})
	});

module.exports = router;
