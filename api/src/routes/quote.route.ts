import { Router } from 'express'
import jwt from 'jsonwebtoken'
import { Quote } from '../models/quote.model'
import { User } from '../models/user.model'
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

		// Verify user token
		const userId = jwt.decode(parsed.token)
		const user = await User.findById(userId)

		if (!user) {
			res.status(401).json({ message: 'quote/save POST No user by that id' })
		}

		const quote = new Quote({
			budget: parsed.budget,
			projectName: parsed.projectName,
			user: userId,
		})

		await quote.save()

		res.status(200).json({ message: 'success' })
	} catch (error) {
		console.log(error)
		res.status(500).json({ error })
	}
})

export { quoteRoutes }
