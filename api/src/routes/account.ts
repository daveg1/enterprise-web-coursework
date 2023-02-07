import { Router } from 'express'

const accountRoutes = Router()

accountRoutes.get('/', (req, res) => {
	res.render('pages/account')
})

export { accountRoutes }
