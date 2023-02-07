import { Router } from 'express'

const loginRoutes = Router()

loginRoutes.get('/', (req, res) => {
	res.render('pages/login')
})

export { loginRoutes }
