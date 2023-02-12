import { Router, urlencoded } from 'express'
import { User } from '../models/user.model'
import { loginSchema, signUpSchema } from '../schemas/auth.schema'
import jwt from 'jsonwebtoken'
import { encrypt } from '../modules/encrypt'

const authRoutes = Router()

authRoutes.use(urlencoded({ extended: true }))

authRoutes.post('/signup', async (req, res) => {
	try {
		const parsed = await signUpSchema.parseAsync(req.body)

		const regex = new RegExp(parsed.username, 'i')
		const user = await User.findOne({ username: { $regex: regex } }, { password: 0 })

		if (user) {
			return res.status(400).json({ reason: 'That username already exists. Please choose another' })
		}

		const hashedPassword = await encrypt(parsed.password)
		parsed.password = hashedPassword

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
			return res.status(400).json({
				reason: "Sorry, that username and password combination didn't work. Please try again.",
			})
		}

		// JWT
		const token = jwt.sign(user.toJSON(), process.env.ACCESS_TOKEN)
		res.status(200).json({ token })
	} catch (error) {
		console.log(error)
		return res.status(500).json({ error })
	}
})

export { authRoutes }
