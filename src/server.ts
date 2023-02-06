import 'dotenv/config'
import express from 'express'
import path from 'node:path'
import { routes } from './routes'

const app = express()

// Set app variables
app.set('port', process.env.PORT || 8080)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

// Set app middlewares
app.use(express.static(__dirname + '/public'))
// app.use(urlencoded({ extended: true }))
app.use(express.json())

// Set app routes
app.use(routes)

// Set port to listen on
app.listen(app.get('port'), () => {
	console.log(`Listening at http://localhost:${app.get('port')}`)
})
