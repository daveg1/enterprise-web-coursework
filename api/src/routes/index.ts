import { Router } from 'express'
import { authRoutes } from './auth.route'
import { paygradeRoutes } from './paygrade.route'
import { quoteRoutes } from './quote.route'

const routes = Router()

routes.use('/auth', authRoutes)
routes.use('/quote', quoteRoutes)
routes.use('/paygrade', paygradeRoutes)

export { routes }
