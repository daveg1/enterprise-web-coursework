import { Router } from 'express'

const calculateRoutes = Router()

calculateRoutes.post('/', (req, res) => {
	console.log(req.body)

	res.json({})
})

export { calculateRoutes }
