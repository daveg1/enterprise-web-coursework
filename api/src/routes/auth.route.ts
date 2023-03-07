import { Router, urlencoded, json } from 'express'
import { User } from '../models/user.model'
import { loginSchema, signUpSchema } from '../schemas/auth.schema'
import jwt from 'jsonwebtoken'
import { encrypt, verify } from '../modules/encrypt'
import { tokenSchema } from '../schemas/token.schema'

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

		// Retreive user from DB
		const user = await User.findOne({ username: { $regex: regex } }, { username: 1, password: 1 })

		if (!user) {
			return res.status(400).json({
				reason: "Sorry, that user doesn't exist. Please check your spelling.",
			})
		}

		// Compare password with hashed password
		const passwordIsValid = await verify(parsed.password, user.password)

		if (!passwordIsValid) {
			return res.status(400).json({
				reason: "Sorry, that password isn't correct. Please try again.",
			})
		}

		// Sign JWT using username and password
		const { username } = user.toJSON()
		const token = jwt.sign(user._id.toString(), process.env.ACCESS_TOKEN)

		res.status(200).json({ username, token, quotes: user.quotes ?? [] })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error })
	}
})

authRoutes.post('/delete', async (req, res) => {
	console.log(req.body)

	try {
		const parsed = await tokenSchema.parseAsync(req.body)

		// Find user by id
		const userId = jwt.decode(parsed.token)
		const user = await User.findById(userId)

		if (!user) {
			return res.status(400).json({
				reason: 'User not found while deleting account.',
			})
		}

		// Remove their saved quotes
		const quoteIds = user.quotes
		await User.deleteMany({ _id: { $in: quoteIds } })

		// Then remove their account
		await user.delete()

		res.status(200).json({})
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error })
	}
})

export { authRoutes }
