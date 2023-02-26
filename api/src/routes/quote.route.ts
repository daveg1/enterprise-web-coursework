import { Router } from 'express'
import { Quote } from '../models/quote.model'
import { calculateQuote } from '../modules/calculateQuote'
import { budgetSchema } from '../schemas/budget.schema'
import { quoteSchema } from '../schemas/quotes.schema'

const quoteRoutes = Router()

quoteRoutes.post('/calculate', async (req, res) => {
	try {
		const parsed = await budgetSchema.parseAsync(req.body)
		const quote = calculateQuote(parsed)

		res.status(200).json({ quote })
	} catch (error) {
		res.status(500).json({ error })
	}
})

quoteRoutes.post('/save', async (req, res) => {
	try {
		const parsed = await quoteSchema.parseAsync(req.body)

		const quote = new Quote(parsed)
		await quote.save()

		res.status(200).json({ message: 'success' })
	} catch (error) {
		res.status(500).json({ error })
	}
})

export { quoteRoutes }
