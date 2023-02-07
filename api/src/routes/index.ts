import { Router } from 'express'
import { accountRoutes } from './account.route'
import { budgetRoutes } from './budget.route'
import { loginRoutes } from './login.route'
import { signupRoutes } from './signup.route'

const routes = Router()

routes.use('/account', accountRoutes)
routes.use('/budget', budgetRoutes)
routes.use('/login', loginRoutes)
routes.use('/signup', signupRoutes)

export { routes }
