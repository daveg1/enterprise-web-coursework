import { z } from 'zod'
import { Budget, budgetSchema } from './budget.schema'

export const quoteSchema = z.object({
	budget: budgetSchema,
	projectName: z.string().max(64),
})

export type Quote = {
	budget: Budget
	projectName: string
}
