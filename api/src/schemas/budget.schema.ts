import { z } from 'zod'

export const budgetSchema = z.object({
	workers: z.array(
		z.object({
			timeWorked: z.number(),
			timeUnit: z.union([z.literal('hours'), z.literal('days'), z.literal('months')]),
			payGrade: z.union([z.literal('junior'), z.literal('standard'), z.literal('senior')]),
		}),
	),

	oneOffCosts: z.array(
		z.object({
			itemName: z.string(),
			cost: z.number(),
		}),
	),

	ongoingCosts: z.array(
		z.object({
			itemName: z.string(),
			cost: z.number(),
			amount: z.number(),
			frequency: z.union([z.literal('weekly'), z.literal('monthly')]),
		}),
	),
})

export type Budget = {
	workers?: {
		timeWorked?: number
		timeUnit?: 'hours' | 'days' | 'months'
		payGrade?: 'junior' | 'standard' | 'senior'
	}[]

	oneOffCosts?: {
		itemName?: string
		cost?: number
	}[]

	ongoingCosts?: {
		itemName?: string
		cost?: number
		amount?: number
		frequency?: 'weekly' | 'monthly'
	}[]
}
