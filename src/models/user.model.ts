import { model, Schema } from 'mongoose'

// TODO fill this in
export type Quote = {}

export interface IUser {
	username: string
	password: string
	firstname: string
	lastname: string
	quotes: Quote[]
}

const schema = new Schema({
	username: { type: String, required: true },
	password: { type: String, required: true },
	firstname: { type: String, required: true },
	lastname: { type: String, required: true },
	quotes: {},
})

const User = model('User', schema)

export { User }
