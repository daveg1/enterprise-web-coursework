import { z } from 'zod'
import { budgetSchema } from './budget.schema'

export const calculateQuoteSchema = z.object({
	budget: budgetSchema,
	useFudge: z.boolean(),
	token: z.string().optional(), // a token must be provided when useFudge is true
})

export const quoteSchema = z.object({
	budgets: z.array(budgetSchema),
	projectName: z.string().max(64),
	token: z.string(),
})

export const quoteIdSchema = z.object({
	id: z.string().length(24),
})

export const updateQuoteSchema = z.object({
	id: z.string().length(24),
	budgets: z.array(budgetSchema),
	token: z.string(),
})

export const mergeQuoteSchema = z.object({
	quoteIds: z.array(z.string().length(24)),
	projectName: z.string().max(64),
	token: z.string(),
})
