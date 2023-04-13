import { z } from 'zod'
import { subtaskSchema } from './subtask.schema'

export const calculateQuoteSchema = z.object({
	subtask: subtaskSchema,
	useFudge: z.boolean(),
	token: z.string().optional(), // a token must be provided when useFudge is true
})

export const calculateQuoteBulkSchema = z.object({
	subtasks: z.array(subtaskSchema),
	useFudge: z.boolean(),
	token: z.string().optional(), // a token must be provided when useFudge is true
})

export const quoteSchema = z.object({
	subtasks: z.array(subtaskSchema),
	projectName: z.string().max(64),
	useFudge: z.boolean(),
	token: z.string(),
})

export const quoteIdSchema = z.object({
	id: z.string().length(24),
})

export const updateQuoteSchema = z.object({
	id: z.string().length(24),
	subtasks: z.array(subtaskSchema),
	useFudge: z.boolean(),
	token: z.string(),
})

export const mergeQuoteSchema = z.object({
	quoteIds: z.array(z.string().length(24)),
	projectName: z.string().max(64),
	token: z.string(),
})
