import { model, Schema } from 'mongoose'
import type { Quote } from '../types/quote'

const schema = new Schema<Quote>({
	budgets: [
		{
			workers: [
				{
					timeWorked: { type: Number, required: true },
					timeUnit: { type: String, required: true, trim: true },
					payGrade: { type: String, required: true, trim: true },
				},
			],

			oneOffCosts: [
				{
					itemName: { type: String, required: true, trim: true },
					cost: { type: Number, required: true },
				},
			],

			ongoingCosts: [
				{
					itemName: { type: String, required: true, trim: true },
					cost: { type: Number, required: true },
					amount: { type: Number, required: true },
					frequency: { type: String, required: true, trim: true },
				},
			],
		},
	],

	estimate: { type: Number, required: true },

	projectName: { type: String, required: true, trim: true },

	user: { type: Schema.Types.ObjectId, ref: 'User' },
})

const Quote = model('Quote', schema)

export { Quote }
