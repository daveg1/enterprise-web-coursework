import { z } from 'zod'

export const signUpSchema = z.object({
	username: z.string(),
	password: z.string(),
	firstname: z.string(),
	lastname: z.string(),
})

export const loginSchema = z.object({
	username: z.string(),
	password: z.string(),
})
