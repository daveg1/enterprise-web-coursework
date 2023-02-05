import { Router } from 'express'
import { calculateQuote } from '../modules/calculateQuote'
import { budgetSchema } from '../schemas/budget.schema'

const calculateRoutes = Router()
calculateRoutes.post('/', async (req, res) => {
	try {
		const parsed = await budgetSchema.parseAsync({
			body: req.body,
		})

		const quote = calculateQuote(parsed.body)

		res.status(200).json({ quote })
	} catch (error) {
		res.status(500).json({ error })
	}
})

export { calculateRoutes }
