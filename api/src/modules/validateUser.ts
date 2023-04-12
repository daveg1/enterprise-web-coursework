import jwt from 'jsonwebtoken'
import { User } from '../models/user.model'
import { Admin } from '../models/admin.model'

export async function validateUser(token: string) {
	if (!token) {
		return null
	}

	const userId = jwt.decode(token)
	const user = await User.findById(userId)

	if (!user) {
		return null
	}

	return user
}

export async function isAdminUser(token: string) {
	if (!token) {
		return null
	}

	const userId = jwt.decode(token)
	const adminUser = await Admin.find({ user: userId })

	return adminUser
}
