import { Router, urlencoded } from 'express'
import { User } from '../models/user.model'
import { userSchema } from '../schemas/user.schema'

const authRoutes = Router()

// TODO: encrypt passwords before storing on database
authRoutes.post('/signup', urlencoded({ extended: true }), async (req, res) => {
	try {
		const parsed = await userSchema.parseAsync(req.body)

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

export { authRoutes }
