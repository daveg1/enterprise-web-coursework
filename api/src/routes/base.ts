import { Router } from 'express'

const baseRoutes = Router()

baseRoutes.get('/', (req, res) => {
	res.render('pages/home')
})

export { baseRoutes }
