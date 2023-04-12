import { z } from 'zod'

export const newPaygradeSchema = z.object({
	role: z.string(),
	hourlyRate: z.number().min(1),
	token: z.string(),
})

export const deletePaygradeSchema = z.object({
	paygradeId: z.string(),
	token: z.string(),
})
