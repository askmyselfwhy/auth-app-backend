const express = require('express');
const cors = require('cors');
const expressValidator = require('express-validator');
const port = process.env.PORT || 4000;
var app = express();

const users = require('./routes/users.js');

app.use(cors());
app.use(express.json());
app.use(expressValidator());
app.use('/users', users);

app.listen(port, (err) => {
	if (err) throw err;
	console.log(`Server has started on port ${port}`);
});

