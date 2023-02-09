import { Router } from 'express'
import { accountRoutes } from './account.route'
import { budgetRoutes } from './budget.route'

const routes = Router()

routes.use('/account', accountRoutes)
routes.use('/budget', budgetRoutes)

export { routes }
