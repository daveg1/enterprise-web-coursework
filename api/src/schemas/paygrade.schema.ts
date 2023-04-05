import { z } from 'zod'

export const paygradeSchema = z.object({
	role: z.string(),
	hourlyRate: z.number().min(10),
})
