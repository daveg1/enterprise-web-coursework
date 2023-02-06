import 'dotenv/config'
import express from 'express'
import path from 'node:path'
import { routes } from './routes'
import { connectDatabase } from './modules/connectDatabase'
import { timestamp } from './modules/timestamp'

const app = express()

// Set app variables
app.set('port', process.env.PORT || 8080)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

// Set app middlewares and routes
app.use(express.static(__dirname + '/public'))
app.use(express.json())
app.use(routes)

// Connect to database, then run server
connectDatabase()
	.then(() => {
		console.log(timestamp(), 'Mongo connection made')

		app.listen(app.get('port'), () => {
			console.log(timestamp(), `Server listening at http://localhost:${app.get('port')}`)
		})
	})
	.catch((error) => {
		console.error(timestamp(), 'Mongo error while making connection', error)
	})
