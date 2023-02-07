import { z } from 'zod'

export const userSchema = z.object({
	username: z.string(),
	password: z.string(),
	firstname: z.string(),
	lastname: z.string(),
})
