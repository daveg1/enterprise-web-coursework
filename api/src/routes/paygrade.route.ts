import { Router } from 'express'
import { Paygrade } from '../models/paygrade.model'
import { deletePaygradeSchema, newPaygradeSchema } from '../schemas/paygrade.schema'
import { isAdminUser } from '../modules/validateUser'

const paygradeRoutes = Router()

/**
 * Gets all the paygrades
 */
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

/**
 * Gets only the roles. This avoids exposing the hourlyRates
 */
paygradeRoutes.get('/roles', async (_, res) => {
	try {
		const paygrades = await Paygrade.find({}, { role: 1 })

		if (!paygrades) {
			throw new Error('No roles found')
		}

		const roles = paygrades.map((pg) => pg.role)

		res.status(200).json(roles)
	} catch (error) {
		res.status(500).json({ error })
	}
})

paygradeRoutes.post('/new', async (req, res) => {
	try {
		const parsed = await newPaygradeSchema.parseAsync(req.body)

		if (!isAdminUser(parsed.token)) {
			return res.status(401).json({ reason: 'insufficient permission' })
		}

		const paygrade = new Paygrade(parsed)
		await paygrade.save()

		res.status(200).json(paygrade.toJSON())
	} catch (error) {
		res.status(500).json({ error })
	}
})

paygradeRoutes.post('/delete', async (req, res) => {
	try {
		const parsed = await deletePaygradeSchema.parseAsync(req.body)

		if (!isAdminUser(parsed.token)) {
			return res.status(401).json({ reason: 'insufficient permission' })
		}

		const paygrade = await Paygrade.deleteOne({ _id: parsed.paygradeId })

		if (!paygrade.deletedCount) {
			return res.status(400).json({ reason: 'paygrade does not exist' })
		}

		res.status(200).json({ message: 'successfully deleted paygrade' })
	} catch (error) {
		res.status(500).json({ error })
	}
})

export { paygradeRoutes }
