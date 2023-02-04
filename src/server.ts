import express from 'express'
import path from 'node:path'

const app = express()

// Set app variables
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

// Set app middlewares
app.use(express.static(__dirname + '/public'))

// Set app routes
app.get('/', (req, res) => {
	res.render('home')
})

// Set port to listen on
app.listen(8080, () => {
	console.log(`Listening at http://localhost:${8080}`)
})
