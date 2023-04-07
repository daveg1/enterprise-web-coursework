import { Router } from 'express'
import jwt from 'jsonwebtoken'
import { Quote } from '../models/quote.model'
import { User } from '../models/user.model'
import { calculateQuote } from '../modules/calculateQuote'
import { budgetSchema } from '../schemas/budget.schema'
import { quoteIdSchema, quoteSchema, updateQuoteSchema } from '../schemas/quotes.schema'
import { tokenSchema } from '../schemas/token.schema'

const quoteRoutes = Router()

quoteRoutes.post('/calculate', async (req, res) => {
	try {
		const parsed = await budgetSchema.parseAsync(req.body)
		// todo rename to 'estimate'
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

		const estimate = calculateQuote(parsed.budget)

		const quote = new Quote({
			budget: parsed.budget,
			estimate,
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

quoteRoutes.post('/update', async (req, res) => {
	try {
		const parsed = await updateQuoteSchema.parseAsync(req.body)

		// Verify user token
		const userId = jwt.decode(parsed.token)
		const user = await User.findById(userId)

		if (!user) {
			res.status(401).json({ message: 'quote/update POST No user by that id' })
		}

		const estimate = calculateQuote(parsed.budget)

		const result = await Quote.findByIdAndUpdate(
			parsed.id,
			{
				budget: parsed.budget,
				estimate,
			},
			{ rawResult: true },
		)

		if (result.ok) {
			res.status(200).json({ message: 'success', estimate })
		} else {
			res.status(500).json({ message: 'failed to update quote' })
		}
	} catch (error) {
		console.log(error)
		res.status(500).json({ error })
	}
})

quoteRoutes.post('/user', async (req, res) => {
	try {
		const parsed = await tokenSchema.parseAsync(req.body)

		// Find quotes saved under the given user id
		const userId = jwt.decode(parsed.token)
		const quotes = await Quote.find({ user: userId }, { user: 0 })

		if (!quotes) {
			res.status(401).json({ message: 'No quotes found' })
		}

		res.status(200).json(quotes)
	} catch (error) {
		console.log(error)
		res.status(500).json({ error })
	}
})

quoteRoutes.post('/id', async (req, res) => {
	const parsed = await quoteIdSchema.parseAsync(req.body)

	const quoteId = parsed.id
	const quote = await Quote.findById(quoteId, { user: 0 })

	if (!quote) {
		res.status(401).json({ message: 'No quote found by that id' })
	}

	res.status(200).json(quote.toJSON())
})

quoteRoutes.post('/delete', async (req, res) => {
	const parsed = await quoteIdSchema.parseAsync(req.body)

	const quoteId = parsed.id
	const quote = await Quote.deleteOne({ _id: quoteId })

	if (!quote.deletedCount) {
		res.status(401).json({ message: 'Failed to delete quote with that id' })
	}

	res.status(200).json({ message: 'Successfully deleted quote', deletedCount: quote.deletedCount })
})

export { quoteRoutes }
