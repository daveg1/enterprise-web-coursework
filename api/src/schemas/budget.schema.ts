import { z } from 'zod'

export const budgetSchema = z.object({
	workers: z.array(
		z.object({
			timeWorked: z.number(),
			timeUnit: z.union([z.literal('hours'), z.literal('days'), z.literal('months')]),
			payGrade: z.string(), // pull from database
		}),
	),

	oneOffCosts: z.array(
		z.object({
			itemName: z.string().max(64),
			cost: z.number(),
		}),
	),

	ongoingCosts: z.array(
		z.object({
			itemName: z.string().max(64),
			cost: z.number(),
			amount: z.number(),
			frequency: z.union([z.literal('weekly'), z.literal('monthly')]),
		}),
	),
})
