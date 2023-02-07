import mongoose from 'mongoose'

export async function connectDatabase() {
	const uri = process.env.MONGO_URI ?? ''
	mongoose.set('strictQuery', false) // Must set strictQuery manually
	await mongoose.connect(uri)
}
