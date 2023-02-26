import { z } from 'zod'
import { budgetSchema } from './budget.schema'

export const quoteSchema = z.object({
	budget: budgetSchema,
	projectName: z.string().max(64),
	token: z.string(),
})
