import { Router } from 'express'
import jwt from 'jsonwebtoken'
import { Quote } from '../models/quote.model'
import { User } from '../models/user.model'
import { calculateQuote } from '../modules/calculateQuote'
import {
	calculateQuoteBulkSchema,
	calculateQuoteSchema,
	mergeQuoteSchema,
	quoteIdSchema,
	quoteSchema,
	updateQuoteSchema,
} from '../schemas/quotes.schema'
import { tokenSchema } from '../schemas/token.schema'
import { isAdminUser } from '../modules/validateUser'

const quoteRoutes = Router()

quoteRoutes.post('/calculate', async (req, res) => {
	try {
		const parsed = await calculateQuoteSchema.parseAsync(req.body)
		let estimate: number

		if (!parsed.useFudge && parsed.token) {
			const user = isAdminUser(parsed.token)

			if (!user) {
				return res.status(401).json({ reason: 'insufficient permission' })
			}

			estimate = await calculateQuote(parsed.subtask, false)
		} else {
			estimate = await calculateQuote(parsed.subtask)
		}

		res.status(200).json({ estimate })
	} catch (error) {
		res.status(500).json({ error })
	}
})

quoteRoutes.post('/calculateBulk', async (req, res) => {
	try {
		const parsed = await calculateQuoteBulkSchema.parseAsync(req.body)
		let useFudge = true

		if (!parsed.useFudge && parsed.token) {
			const user = isAdminUser(parsed.token)

			if (!user) {
				return res.status(401).json({ reason: 'insufficient permission' })
			}

			useFudge = false
		}

		const estimates = []
		let total = 0

		for (const subtask of parsed.subtasks) {
			const cost = await calculateQuote(subtask, useFudge)
			estimates.push(cost)
			total += cost
		}

		res.status(200).json({ estimates, total })
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

		let useFudge = true

		if (!parsed.useFudge && parsed.token) {
			const user = isAdminUser(parsed.token)

			if (!user) {
				return res.status(401).json({ reason: 'insufficient permission' })
			}

			useFudge = false
		}

		let estimate = 0

		for (const subtask of parsed.subtasks) {
			const cost = await calculateQuote(subtask, useFudge)
			estimate += cost
		}

		const quote = new Quote({
			subtasks: parsed.subtasks,
			estimate,
			projectName: parsed.projectName,
			user: userId,
		})

		await quote.save()

		res.status(200).json(quote.toJSON())
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

		let useFudge = true

		if (!parsed.useFudge && parsed.token) {
			const user = isAdminUser(parsed.token)

			if (!user) {
				return res.status(401).json({ reason: 'insufficient permission' })
			}

			useFudge = false
		}

		let estimate = 0

		for (const subtask of parsed.subtasks) {
			const cost = await calculateQuote(subtask, useFudge)
			estimate += cost
		}

		const result = await Quote.findByIdAndUpdate(
			parsed.id,
			{
				subtasks: parsed.subtasks,
				estimate,
			},
			{ rawResult: true },
		)

		if (result.ok) {
			res.status(200).json(result.value)
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

quoteRoutes.post('/merge', async (req, res) => {
	try {
		const parsed = await mergeQuoteSchema.parseAsync(req.body)

		// Verify user token
		const userId = jwt.decode(parsed.token)
		const user = await User.findById(userId)

		if (!user) {
			res.status(401).json({ message: 'quote/update POST No user by that id' })
		}

		let subtasks = []
		let estimates = 0

		// Tally everything up
		for (const quoteId of parsed.quoteIds) {
			const quote = await Quote.findById(quoteId)
			subtasks = [...subtasks, ...quote.subtasks]
			estimates += quote.estimate
		}

		// Remove the individual quotes
		await Quote.deleteMany({ _id: { $in: parsed.quoteIds } })

		// Create new combined quote
		const quote = new Quote({
			subtasks: subtasks,
			estimate: estimates,
			projectName: parsed.projectName,
			user: userId,
		})

		await quote.save()

		res.status(200).json(quote.toJSON())
	} catch (error) {
		res.status(500).json({ error })
	}
})

export { quoteRoutes }
