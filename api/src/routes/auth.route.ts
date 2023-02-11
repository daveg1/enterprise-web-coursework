import { Router, urlencoded } from 'express'
import { User } from '../models/user.model'
import { loginSchema, signUpSchema } from '../schemas/auth.schema'

const authRoutes = Router()

authRoutes.use(urlencoded({ extended: true }))

// TODO: encrypt passwords before storing on database
authRoutes.post('/signup', async (req, res) => {
	try {
		const parsed = await signUpSchema.parseAsync(req.body)

		const regex = new RegExp(parsed.username, 'i')
		const user = await User.findOne({ username: { $regex: regex } }, { password: 0 })

		if (user) {
			return res.status(400).json({ reason: 'That username already exists. Please choose another' })
		}

		const newUser = new User(parsed)
		await newUser.save()

		res.status(200).json({ firstname: parsed.firstname })
	} catch (error) {
		res.status(500).json({ error })
	}
})

authRoutes.post('/login', async (req, res) => {
	try {
		const parsed = await loginSchema.parseAsync(req.body)

		const regex = new RegExp(parsed.username, 'i')
		const user = await User.findOne(
			{ username: { $regex: regex }, password: parsed.password },
			{ password: 0 },
		)

		if (!user) {
			return res.status(401).json({ error: 'User not found' })
		}

		// JWT
	} catch (error) {
		return res.status(500).json({ error })
	}
})

export { authRoutes }
