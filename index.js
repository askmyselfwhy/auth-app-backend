const express = require('express');
// const cors = require('cors');
const port = process.env.PORT || 4000;
var app = express();

const users = require('./routes/users.js');

app.use(cors());
app.use(express.json());
app.use('/users', users);

// app.get('*', function (req, res) {
// 	res.write('HELLO YOU ARE IN MY APP!')
// })

// // my-auth-test-app-server.herokuapp.com/

app.listen(port, (err) => {
	if (err) throw err;
	console.log(`Server has started on port ${port}`);
});

// var http = require("http");

// http.createServer(function (request, response) {
// 	response.writeHead(200, { "Content-Type": "text/plain" });
// 	response.write("Hello World");
// 	response.write(process.env.PORT);
// 	response.write('SOMETING WEIRD IS GOING ON')
// 	response.end();

// 	console.log("I am working");
// }).listen(process.env.PORT || 8888);


// const path = require('path');
// const app = require('express')();

// const port = process.env.PORT || 8080;

// app.listen(port, () => {
// 	console.log(`Listening on http://localhost:${port}/`);
// });
