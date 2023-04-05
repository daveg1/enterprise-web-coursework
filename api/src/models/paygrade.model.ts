import { model, Schema } from 'mongoose'
import type { Paygrade } from '../types/paygrade'

const schema = new Schema<Paygrade>({
	role: { type: String, required: true, unique: true, trim: true },
	hourlyRate: { type: Number, required: true, min: 10 },
})

const Paygrade = model('Paygrade', schema)

export { Paygrade }
