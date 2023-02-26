import { model, Schema } from 'mongoose'
import type { Quote } from '../types/quote'

const schema = new Schema<Quote>({
	budget: {
		workers: [
			{
				timeWorked: { type: Number, required: true },
				timeUnit: { type: String, required: true },
				payGrade: { type: String, required: true },
			},
		],

		oneOffCosts: [
			{
				itemName: { type: String, required: true },
				cost: { type: Number, required: true },
			},
		],

		ongoingCosts: [
			{
				itemName: { type: String, required: true },
				cost: { type: Number, required: true },
				amount: { type: Number, required: true },
				frequency: { type: String, required: true },
			},
		],
	},

	projectName: { type: String, required: true },
})

const Quote = model('Quote', schema)

export { Quote }
