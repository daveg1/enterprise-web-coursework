import { Router } from 'express'
import { authRoutes } from './auth.route'
import { budgetRoutes } from './budget.route'

const routes = Router()

routes.use('/auth', authRoutes)
routes.use('/budget', budgetRoutes)

export { routes }
