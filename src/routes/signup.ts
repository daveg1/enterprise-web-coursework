import { Router } from 'express'

const signupRoutes = Router()

signupRoutes.get('/', (req, res) => {
	res.render('pages/sign-up')
})

export { signupRoutes }
