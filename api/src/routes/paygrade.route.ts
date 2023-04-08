import { Router } from 'express'
import { Paygrade } from '../models/paygrade.model'
import { paygradeSchema } from '../schemas/paygrade.schema'

const paygradeRoutes = Router()

paygradeRoutes.get('/all', async (_, res) => {
	try {
		const paygrades = await Paygrade.find()

		if (!paygrades) {
			throw new Error('No paygrades found')
		}

		res.status(200).json(paygrades)
	} catch (error) {
		res.status(500).json({ error })
	}
})

paygradeRoutes.post('/new', async (req, res) => {
	try {
		const parsed = await paygradeSchema.parseAsync(req.body)
		const paygrade = new Paygrade(parsed)
		await paygrade.save()

		res.status(200).json(paygrade.toJSON())
	} catch (error) {
		res.status(500).json({ error })
	}
})

export { paygradeRoutes }
