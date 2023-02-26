import { Router } from 'express'
import { authRoutes } from './auth.route'
import { quoteRoutes } from './quote.route'

const routes = Router()

routes.use('/auth', authRoutes)
routes.use('/quote', quoteRoutes)

export { routes }
