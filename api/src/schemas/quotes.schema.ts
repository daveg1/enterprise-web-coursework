import { z } from 'zod'
import { budgetSchema } from './budget.schema'

export const quoteSchema = z.object({
	budget: budgetSchema,
	projectName: z.string().max(64),
	token: z.string(),
})

export const quoteIdSchema = z.object({
	id: z.string().length(24),
})

export const updateQuoteSchema = z.object({
	id: z.string().length(24),
	budget: budgetSchema,
	token: z.string(),
})

export const mergeQuoteSchema = z.object({
	quoteIds: z.array(z.string().length(24)),
	projectName: z.string().max(64),
	token: z.string(),
})
