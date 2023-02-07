import { z } from 'zod'

export const budgetSchema = z.object({
	timeWorked: z.number(),
	timeUnit: z.union([z.literal('hours'), z.literal('days'), z.literal('months')]),
	payGrade: z.union([z.literal('junior'), z.literal('standard'), z.literal('senior')]),
	oneOffCost: z.number(),
	ongoingCost: z.number(),
	ongoingFrequency: z.union([z.literal('weekly'), z.literal('monthly')]),
})

export type Budget = {
	timeWorked?: number
	timeUnit?: 'hours' | 'days' | 'months'
	payGrade?: 'junior' | 'standard' | 'senior'
	oneOffCost?: number
	ongoingCost?: number
	ongoingFrequency?: 'weekly' | 'monthly'
}