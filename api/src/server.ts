import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import http from 'http'
import nodeCleanup from 'node-cleanup'
import { connectDatabase } from './modules/connectDatabase'
import { timestamp } from './modules/timestamp'
import { routes } from './routes'

const app = express()
const server = http.createServer(app)

// Set app variables
app.set('port', process.env.PORT || 8080)

// Set app middlewares and routes
app.use(cors())
app.use(express.static(__dirname + '/public'))
app.use(express.json())
app.use(routes)

console.log(timestamp(), 'Server starting...')

// Connect to database, then run server
connectDatabase()
	.then(() => {
		console.log(timestamp(), 'Mongo connection made')

		server.listen(app.get('port'), () => {
			console.log(timestamp(), `Server listening at http://localhost:${app.get('port')}`)
		})
	})
	.catch((error) => {
		console.error(timestamp(), 'Mongo error while making connection', error)
	})

nodeCleanup(() => {
	console.log(timestamp(), `Server closing...`)
	server.close()
})
