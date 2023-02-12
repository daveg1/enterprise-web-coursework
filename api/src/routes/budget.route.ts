import { Router } from 'express'
import { calculateQuote } from '../modules/calculateQuote'
import { budgetSchema } from '../schemas/budget.schema'

const budgetRoutes = Router()

budgetRoutes.post('/', async (req, res) => {
	try {
		const parsed = await budgetSchema.parseAsync(req.body)

		const quote = calculateQuote(parsed)

		res.status(200).json({ quote })
	} catch (error) {
		res.status(500).json({ error })
	}
})

export { budgetRoutes }
