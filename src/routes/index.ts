import { Router } from 'express'
import { accountRoutes } from './account'
import { baseRoutes } from './base'
import { loginRoutes } from './login'
import { signupRoutes } from './signup'

const routes = Router()

routes.use('/', baseRoutes)
routes.use('/account', accountRoutes)
routes.use('/login', loginRoutes)
routes.use('/signup', signupRoutes)

export { routes }
