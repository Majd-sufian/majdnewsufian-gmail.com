const express = require('express')
const app = express()
const Twitter = require('./api/helpers/twitter')
const twitter = new Twitter()
const port = 3000
require('dotenv').config()


app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
});
app.use(express.json());

app.get('/tweets', (req, res) => {
	// console.log(req.query)
	// i need to pass query in the url in order to get the next variables
	const query = req.query.q 
	const count = req.query.count
	const maxId = req.query.max_id

	twitter.get(query, count, maxId).then((response) => {
		res.status(200).send(response.data)
	}).catch((error) => {
		res.status(400).send(error)
	})
})


app.listen(port, () => console.log(`Example app listening on port ${port}!`))