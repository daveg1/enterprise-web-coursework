import { model, Schema } from 'mongoose'
import type { User } from '../types/user'

const schema = new Schema<User>({
	username: { type: String, required: true, unique: true, trim: true },
	password: { type: String, required: true, trim: true },
	firstname: { type: String, required: true, trim: true },
	lastname: { type: String, required: true, trim: true },
	quotes: [{ type: Schema.Types.ObjectId, ref: 'Quote' }],
})

const User = model('User', schema)

export { User }
