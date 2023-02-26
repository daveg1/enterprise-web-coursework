import { model, Schema } from 'mongoose'
import type { Quote } from '../types/quote'

export interface IUser {
	username: string
	password: string
	firstname: string
	lastname: string
	quotes: Quote[]
}

const schema = new Schema({
	username: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	firstname: { type: String, required: true },
	lastname: { type: String, required: true },
	quotes: [{ type: Schema.Types.ObjectId, ref: 'Quote' }],
})

const User = model('User', schema)

export { User }
